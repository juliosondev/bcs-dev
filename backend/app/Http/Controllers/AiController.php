<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiController extends Controller
{
    /**
     * BCS AI — assistente que responde a questões sobre financiamento e
     * crédito em Angola, com base na legislação angolana e nos regulamentos
     * do Banco BCS. Chama a API da Claude (Anthropic).
     */
    public function chat(Request $request)
    {
        $data = $request->validate([
            'messages' => 'required|array|min:1|max:40',
            'messages.*.role' => 'required|in:user,assistant',
            'messages.*.content' => 'required|string|max:4000',
        ]);

        $cfg = config('services.anthropic');
        $question = (string) ($data['messages'][count($data['messages']) - 1]['content'] ?? '');

        // Sem chave configurada → modo demonstração
        if (empty($cfg['key'])) {
            return response()->json(['reply' => $this->demoReply($question), 'demo' => true]);
        }

        $system = <<<'PROMPT'
És o BCS AI, o assistente virtual do Banco BCS (Banco de Crédito do Sul, S.A.), em Angola.

A tua função é responder a questões sobre financiamento e crédito em Angola, com base na legislação angolana e nos regulamentos, produtos e serviços do Banco BCS (contas, cartões, poupança e investimento, crédito e serviços como o BCS EasyPay).

Regras:
- Responde sempre em português de Angola, de forma clara, objetiva e educada.
- Mantém o foco em financiamento, crédito e serviços bancários do BCS.
- As respostas são meramente informativas e não constituem aconselhamento jurídico ou financeiro personalizado, nem uma decisão de concessão de crédito — esta depende sempre de análise e aprovação do banco.
- Não inventes taxas, valores, prazos ou artigos de lei específicos. Se não tiveres a informação com certeza, diz que não a tens e encaminha o cliente para o banco.
- Sempre que a questão exigir dados concretos ou análise específica, recomenda o contacto com o BCS: BCS Consigo (+244) 225 300 803, ou uma agência BCS.
- Sê conciso: respostas curtas e úteis.
PROMPT;

        $headers = [
            'x-api-key' => $cfg['key'],
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ];
        // Chaves de organização exigem o workspace; chaves de workspace não precisam.
        if (! empty($cfg['workspace'])) {
            $headers['anthropic-workspace-id'] = $cfg['workspace'];
        }

        try {
            $resp = Http::withHeaders($headers)->timeout(60)->post('https://api.anthropic.com/v1/messages', [
                'model' => $cfg['model'],
                'max_tokens' => 1500,
                'output_config' => ['effort' => 'low'],
                'system' => $system,
                'messages' => $data['messages'],
            ]);

            if (! $resp->successful()) {
                Log::error('BCS AI erro', ['status' => $resp->status(), 'body' => $resp->body()]);
                // Falha da API (ex.: sem créditos) → modo demonstração
                return response()->json(['reply' => $this->demoReply($question), 'demo' => true]);
            }

            $text = '';
            foreach ($resp->json('content', []) as $block) {
                if (($block['type'] ?? '') === 'text') {
                    $text .= $block['text'];
                }
            }

            if (trim($text) === '') {
                return response()->json(['reply' => $this->demoReply($question), 'demo' => true]);
            }

            return response()->json(['reply' => trim($text)]);
        } catch (\Throwable $e) {
            Log::error('BCS AI exceção', ['error' => $e->getMessage()]);
            return response()->json(['reply' => $this->demoReply($question), 'demo' => true]);
        }
    }

    /**
     * Modo demonstração — respostas de exemplo por tema, usadas quando a API
     * não está disponível (sem chave, sem créditos ou erro). Assim que a conta
     * tiver créditos, as respostas reais do BCS AI passam a ser usadas.
     */
    private function demoReply(string $question): string
    {
        $q = mb_strtolower($question);
        $has = fn (array $words) => (bool) array_filter($words, fn ($w) => str_contains($q, $w));
        $contacto = "Para mais detalhes, contacte o BCS Consigo: (+244) 225 300 803.";

        if ($has(['cartão', 'cartao', 'cartões', 'cartoes', 'multicaixa', 'mastercard'])) {
            $r = "O Banco BCS disponibiliza vários cartões:\n• Cartão de Débito Multicaixa — acesso instantâneo à sua conta, para pagamentos e levantamentos em todo o território nacional.\n• Cartão de Crédito Mastercard (Gold e World) — para compras dentro e fora de Angola, com benefícios exclusivos.\n• Cartão Pré-pago Sublime — recarregável, ideal para viagens e compras online.\nPode geri-los pelo MyBCS.";
        } elseif ($has(['easypay', 'receb', 'pagament', 'tpa', 'terminal', 'negócio', 'negocio'])) {
            $r = "O BCS EasyPay é a solução de recebimentos para o seu negócio: aceite pagamentos por cartão de forma simples e segura, acompanhe as vendas em tempo real e receba a liquidação diretamente na sua conta BCS.\n" . $contacto;
        } elseif ($has(['habitação', 'habitacao', 'casa', 'imóvel', 'imovel', 'moradia'])) {
            $r = "O Crédito Habitação do BCS destina-se à compra, construção ou obras na sua casa. O montante, o prazo e a prestação dependem do valor do imóvel, da entrada e do seu perfil. Pode fazer uma estimativa na aba \"Simulador de Crédito\".\nA aprovação depende de análise do banco. " . $contacto;
        } elseif ($has(['automóvel', 'automovel', 'carro', 'viatura', 'moto'])) {
            $r = "O Crédito Automóvel do BCS ajuda-o a comprar a sua viatura, com prazos e prestações adaptados a si. Simule na aba \"Simulador de Crédito\".\nA concessão está sujeita a análise e aprovação. " . $contacto;
        } elseif ($has(['antecipa', 'salário', 'salario', 'ordenado', 'adiantamento'])) {
            $r = "O BCS Antecipa permite antecipar parte do seu salário para fazer face a necessidades pontuais, de forma rápida. As condições dependem do seu vínculo e perfil. " . $contacto;
        } elseif ($has(['descoberto', 'imprevisto', 'liquidez imediata'])) {
            $r = "O Descoberto Flex do BCS dá-lhe liquidez para imprevistos, permitindo movimentar além do saldo disponível, dentro de um limite acordado. " . $contacto;
        } elseif ($has(['crédito', 'credito', 'financ', 'emprést', 'emprest'])) {
            $r = "O BCS tem soluções de crédito para vários objetivos:\n• Crédito ao consumo — para os seus projetos pessoais.\n• Crédito automóvel — para a compra de viatura.\n• Crédito habitação — para a sua casa.\n• BCS Antecipa — antecipação do salário.\n• Descoberto Flex — liquidez para imprevistos.\nA concessão depende de análise e aprovação do banco. " . $contacto;
        } elseif ($has(['transfer', 'enviar dinheiro', 'transacç', 'transac'])) {
            $r = "Com o BCS pode fazer transferências de forma simples, inclusive pelo MyBCS, a qualquer hora. Para transferências internacionais ou limites específicos, confirme as condições com o banco. " . $contacto;
        } elseif ($has(['câmbio', 'cambio', 'moeda', 'dólar', 'dolar', 'euro', 'divisa', 'kwanza'])) {
            $r = "As taxas de câmbio variam ao longo do dia. No topo da página encontra um indicador com os valores de compra e venda das principais moedas. Para operações de câmbio, contacte o banco. " . $contacto;
        } elseif ($has(['mybcs', 'app', 'aplicativo', 'aplicação', 'aplicacao', 'telemóvel', 'telemovel', 'telefone'])) {
            $r = "O MyBCS é o aplicativo do Banco BCS: consulte saldos e movimentos, faça transferências e pagamentos, simule créditos e depósitos e controle os seus cartões — a qualquer hora e com segurança. Está disponível na App Store e no Google Play.";
        } elseif ($has(['depósito', 'deposito', 'poupanç', 'poupanc', 'investi', 'rende', 'gold', 'liquidez', 'fundo'])) {
            $r = "Para fazer o seu dinheiro render, o BCS tem soluções de poupança e investimento: Depósito a Prazo, Poupança Online, BCS Gold, BCS Liquidez e Fundos de Investimento. Pode simular um depósito a prazo na aba \"Simulador de Depósito a Prazo\".";
        } elseif ($has(['taxa', 'juro', 'tae', 'teg'])) {
            $r = "As taxas de juro dependem do produto, do prazo e do seu perfil. Os valores dos simuladores são indicativos; para as condições reais e atualizadas, consulte o preçário do BCS ou o seu gestor. " . $contacto;
        } elseif ($has(['comiss', 'preçário', 'precario', 'preçario', 'custo', 'anuidade', 'manutenção', 'manutencao'])) {
            $r = "As comissões e os custos de cada produto constam do preçário do Banco BCS. Consulte o preçário atualizado ou fale com o seu gestor para os valores aplicáveis ao seu caso. " . $contacto;
        } elseif ($has(['document', 'requisito', 'preciso', 'preciso de', 'elegib'])) {
            $r = "Regra geral, para pedir um crédito são necessários documentos como bilhete de identidade, comprovativo de morada e comprovativo de rendimentos. Os requisitos exatos variam consoante o produto e o seu perfil. " . $contacto;
        } elseif ($has(['idade', 'menor', 'jovem', 'júnior', 'junior', 'criança', 'crianca', 'filho'])) {
            $r = "A Conta Júnior do BCS foi pensada para os mais novos, ajudando a criar hábitos de poupança desde cedo, com acompanhamento dos pais ou responsáveis. Para requisitos de idade e abertura, " . lcfirst($contacto);
        } elseif ($has(['segur', 'fraude', 'roubo', 'perdi', 'perda', 'bloque', 'clonad'])) {
            $r = "A segurança é uma prioridade do BCS. Em caso de perda, roubo ou suspeita de fraude, pode bloquear o cartão de imediato pelo MyBCS e contactar já o BCS Consigo: (+244) 225 300 803. Os cartões dispõem de chip e tecnologia contactless com confirmação segura das operações.";
        } elseif ($has(['conta', 'abrir'])) {
            $r = "Pode abrir a sua conta no BCS de forma simples, inclusive online pelo MyBCS. Existem várias contas: Conta à Ordem, Conta Flex, Conta Simplificada e Conta Júnior (para os mais novos). Ao abrir conta passa a ter acesso aos serviços essenciais e a diversos benefícios.";
        } elseif ($has(['reclama', 'denúncia', 'denuncia', 'provedoria', 'ouvidoria'])) {
            $r = "O BCS dispõe de um Canal de Denúncias e de Suporte ao Cliente (Provedoria do Cliente) para tratar reclamações e situações que precise de reportar. " . $contacto;
        } elseif ($has(['lei', 'regulament', 'bna', 'legisla', 'normativ'])) {
            $r = "O Banco BCS é uma instituição financeira regulada em Angola e a sua atividade rege-se pela legislação e pelos regulamentos aplicáveis do setor. Para uma questão jurídica específica, recomendo o contacto com o banco para orientação adequada. " . $contacto;
        } elseif ($has(['contact', 'agência', 'agencia', 'falar', 'apoio', 'horário', 'horario', 'atendimento'])) {
            $r = "Pode falar com o BCS através do BCS Consigo: (+244) 225 300 803, ou dirigir-se a uma agência BCS. Estamos disponíveis para o ajudar.";
        } else {
            $r = "Posso ajudar com dúvidas sobre contas, cartões, crédito (consumo, automóvel, habitação, BCS Antecipa), poupança e investimento, câmbios, o app MyBCS e serviços como o EasyPay.\nExperimente perguntar, por exemplo: \"Que tipos de crédito o BCS oferece?\", \"Como abrir uma conta?\" ou \"O que é o MyBCS?\". " . $contacto;
        }

        return $r;
    }
}

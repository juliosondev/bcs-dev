<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RegistrationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'person_type'  => 'required|in:singular,empresa',
            'phone'        => 'required|string|max:30',
            'email'        => 'nullable|email|max:255',
            'password'     => 'nullable|string|min:6',
            // singular
            'full_name'    => 'nullable|string|max:255',
            'bi_number'    => 'nullable|string|max:50',
            'situacao'     => 'nullable|in:empregado,estudante',
            'work_entity'  => 'nullable|string|max:255',
            'work_role'    => 'nullable|string|max:255',
            // empresa
            'company_name' => 'nullable|string|max:255',
            'company_nif'  => 'nullable|string|max:50',
            'manager_name' => 'nullable|string|max:255',
            'manager_bi'   => 'nullable|string|max:50',
            'manager_role' => 'nullable|string|max:100',
        ]);

        // Guarda no banco de dados (palavra-passe cifrada)
        $registration = Registration::create(array_merge($data, [
            'password' => !empty($data['password']) ? Hash::make($data['password']) : null,
        ]));

        // Envia SMS de confirmação para o telefone inserido
        [$smsStatus, $smsBody] = $this->enviarSms($data);
        $registration->update(['sms_status' => $smsStatus, 'sms_response' => $smsBody]);

        return response()->json([
            'ok'  => true,
            'id'  => $registration->id,
            'sms' => $smsStatus,
        ], 201);
    }

    /**
     * @return array{0:string,1:?string}
     */
    private function enviarSms(array $data): array
    {
        $nome = $data['person_type'] === 'empresa'
            ? ($data['company_name'] ?? 'Cliente')
            : ($data['full_name'] ?? 'Cliente');

        $mensagem = "Ola {$nome}, o seu registo no Banco BCS foi recebido com sucesso. Em breve entraremos em contacto.";
        $telefone = $this->normalizarTelefone($data['phone']);

        $cfg = config('services.smsillico');

        try {
            $response = Http::timeout(10)->post($cfg['url'], [
                'authentification' => [
                    'username' => $cfg['username'],
                    'password' => $cfg['password'],
                ],
                'message' => [[
                    'sender' => $cfg['sender'],
                    'text' => $mensagem,
                    'recipients' => [
                        ['gsm' => $telefone],
                    ],
                ]],
            ]);

            return [$response->successful() ? 'sent' : 'failed', $response->body()];
        } catch (\Throwable $e) {
            Log::error('SMS BCS falhou', ['error' => $e->getMessage()]);
            return ['error', $e->getMessage()];
        }
    }

    /** Normaliza o número para o formato internacional de Angola (244…). */
    private function normalizarTelefone(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone);

        if (str_starts_with($digits, '244')) {
            return $digits;
        }

        return '244' . ltrim($digits, '0');
    }
}

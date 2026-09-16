<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->enum('person_type', ['singular', 'empresa']);
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('password')->nullable();

            // Cliente singular
            $table->string('full_name')->nullable();
            $table->string('bi_number')->nullable();
            $table->string('situacao')->nullable(); // empregado | estudante
            $table->string('work_entity')->nullable(); // entidade empregadora / instituição de ensino
            $table->string('work_role')->nullable();   // profissão / curso

            // Cliente empresa
            $table->string('company_name')->nullable();
            $table->string('company_nif')->nullable();
            $table->string('manager_name')->nullable();
            $table->string('manager_bi')->nullable();
            $table->string('manager_role')->nullable();

            // Resultado do envio de SMS
            $table->string('sms_status')->nullable();
            $table->text('sms_response')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    protected $fillable = [
        'person_type',
        'phone',
        'email',
        'password',
        'full_name',
        'bi_number',
        'situacao',
        'work_entity',
        'work_role',
        'company_name',
        'company_nif',
        'manager_name',
        'manager_bi',
        'manager_role',
        'sms_status',
        'sms_response',
    ];

    protected $hidden = [
        'password',
    ];
}

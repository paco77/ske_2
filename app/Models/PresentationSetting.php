<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PresentationSetting extends Model
{
    protected $fillable = [
        'profile_image',
        'logo',
        'name',
        'title',
        'email',
        'whatsapp',
        'phone',
        'about_title',
        'about_text',
        'contact_title',
        'contact_email',
        'contact_phone',
        'contact_address',
        'brands_images',
        'website_link',
        'website_button_text',
    ];

    protected $casts = [
        'brands_images' => 'array',
    ];
}

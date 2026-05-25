<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactInfo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Contact/Index', [
            'contact' => ContactInfo::first(),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'whatsapp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:500',
        ]);

        $contact = ContactInfo::first();
        if ($contact) {
            $contact->update($data);
        }
        else {
            ContactInfo::create($data);
        }

        return redirect()->back()->with('success', 'Información de contacto actualizada.');
    }
}

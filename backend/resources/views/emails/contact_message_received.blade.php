<!DOCTYPE html>
<html>
<head>
    <title>Nuevo mensaje de contacto</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #3b2e12;">Nuevo mensaje de contacto recibido</h2>
    <p>Has recibido un nuevo mensaje a través del formulario de contacto de la web.</p>
    <table style="width: 100%; max-width: 600px; border-collapse: collapse; margin-top: 20px;">
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Nombre:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{ $contact->name }}</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Email:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{ $contact->email }}</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Teléfono:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{ $contact->phone ?? 'No proporcionado' }}</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>¿Cómo nos conoció?:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{ $contact->referral_source ?? 'No especificado' }}</td>
        </tr>
    </table>
    
    <h3 style="margin-top: 20px; color: #3b2e12;">Mensaje:</h3>
    <div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #c9a24d;">
        {!! nl2br(e($contact->message)) !!}
    </div>
</body>
</html>

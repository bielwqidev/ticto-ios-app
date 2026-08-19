import os
import base64

base_dir = r'c:\Users\biel\Documents\CLIENTES\ticto\notificacao-iphone'
logo_path = os.path.join(base_dir, 'logo_padded.png')

with open(logo_path, 'rb') as f:
    icon_base64 = base64.b64encode(f.read()).decode('utf-8')

mobileconfig_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>FullScreen</key>
            <true/>
            <key>Icon</key>
            <data>{icon_base64}</data>
            <key>IsRemovable</key>
            <true/>
            <key>Label</key>
            <string>Ticto</string>
            <key>PayloadDescription</key>
            <string>Aplicativo Oficial Ticto Notificações</string>
            <key>PayloadDisplayName</key>
            <string>Ticto</string>
            <key>PayloadIdentifier</key>
            <string>com.ticto.notificacoes.webclip</string>
            <key>PayloadType</key>
            <string>com.apple.webClip.managed</string>
            <key>PayloadUUID</key>
            <string>3A4B5C6D-7E8F-9A0B-1C2D-3E4F5A6B7C8D</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>Precomposed</key>
            <true/>
            <key>URL</key>
            <string>http://192.168.100.12:5501/index.html</string>
        </dict>
    </array>
    <key>PayloadDisplayName</key>
    <string>Ticto Notificações</string>
    <key>PayloadIdentifier</key>
    <string>com.ticto.notificacoes</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>1A2B3C4D-5E6F-7A8B-9C0D-1E2F3A4B5C6D</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>'''

profile_path = os.path.join(base_dir, 'ticto.mobileconfig')
with open(profile_path, 'w', encoding='utf-8') as f:
    f.write(mobileconfig_content)

# Also copy to notificacao folder so server can serve it directly
notif_dir = r'c:\Users\biel\Documents\CLIENTES\ticto\notificacao'
notif_profile_path = os.path.join(notif_dir, 'ticto.mobileconfig')
with open(notif_profile_path, 'w', encoding='utf-8') as f:
    f.write(mobileconfig_content)

print('SUCCESS: ticto.mobileconfig gerado com sucesso!')

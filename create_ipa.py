import os
import zipfile

plist_content = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDevelopmentRegion</key>
	<string>en</string>
	<key>CFBundleDisplayName</key>
	<string>Ticto</string>
	<key>CFBundleExecutable</key>
	<string>Ticto</string>
	<key>CFBundleIdentifier</key>
	<string>com.ticto.notificacoes</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>CFBundleName</key>
	<string>Ticto</string>
	<key>CFBundlePackageType</key>
	<string>APPL</string>
	<key>CFBundleShortVersionString</key>
	<string>1.0.0</string>
	<key>CFBundleVersion</key>
	<string>1.0.0</string>
	<key>LSRequiresIPhoneOS</key>
	<true/>
</dict>
</plist>"""

base_dir = r'c:\Users\biel\Documents\CLIENTES\ticto\notificacao-iphone'
ipa_path = os.path.join(base_dir, 'Ticto.ipa')

with zipfile.ZipFile(ipa_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    zipf.writestr('Payload/Ticto.app/Info.plist', plist_content)
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.ipa') or file.endswith('.py'):
                continue
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, base_dir)
            zipf.write(file_path, os.path.join('Payload/Ticto.app', rel_path))

print('SUCCESS: Ticto.ipa criado em:', ipa_path)

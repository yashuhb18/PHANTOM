; Inno Setup Script for PHANTOM Platform
; Produces a standard Windows Setup installer (PHANTOM-Setup-v1.0.exe)

[Setup]
AppId={{D8210928-8547-49F1-8CE1-5B3F40B342E1}
AppName=PHANTOM Autonomous USB Threat Hunting Platform
AppVersion=1.0.0
AppPublisher=PHANTOM Cyber Defense
DefaultDirName={autopf}\PHANTOM
DefaultGroupName=PHANTOM Platform
UninstallDisplayIcon={app}\PHANTOM.exe
Compression=lzma2/ultra64
SolidCompression=yes
OutputDir=dist_installer
OutputBaseFilename=PHANTOM-Setup-v1.0
WizardStyle=modern
PrivilegesRequired=lowest

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "dist\PHANTOM.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "backend\decoy_files\*"; DestDir: "{app}\backend\decoy_files"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\PHANTOM Platform"; Filename: "{app}\PHANTOM.exe"
Name: "{autodesktop}\PHANTOM Platform"; Filename: "{app}\PHANTOM.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\PHANTOM.exe"; Description: "{cm:LaunchProgram,PHANTOM Platform}"; Flags: nowait postinstall skipifsilent

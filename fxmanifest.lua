fx_version 'cerulean'
game 'gta5'

name 'VaultHack'
author 'Nicky'
description 'A simple, TFD inspired hack'
version '1.0.0'

lua54 'yes'

shared_scripts {
	'config.lua'
}

client_scripts {
	'client/main.lua'
}

files {
	'html/*.**',
  'html/js/*.**',
  'html/css/*.**',
  'html/images/*.**',
  'html/sounds/*.mp3',
}

ui_page 'html/index.html'

--[[ escrow_ignore {
  'config.lua',
  'client/*.lua',
	'html/*.**',
  'locales/*.lua',
  'assets/*.*',
} ]]

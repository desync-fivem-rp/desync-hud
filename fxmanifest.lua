fx_version "cerulean"

description "Desync HUD"
author "Desync"
version '1.0.0'

lua54 'yes'

games {
  "gta5",
  "rdr3"
}

ui_page 'web/build/index.html'

shared_scripts {
  '@ox_lib/init.lua',
  'config.lua',
  '@ox_core/lib/init.lua'
}


client_scripts {
  'client/modules/utils.lua',
  'client/modules/state.lua',
  'client/modules/ui.lua',
  'client/modules/player.lua',
  'client/modules/vehicle.lua',
  'client/modules/notifications.lua',
  'client/client.lua'
}

server_scripts {
  'server/modules/notifications.lua',
  'server/server.lua'
}

files {
	'web/build/index.html',
	'web/build/**/*',
}

dependencies {
	'ox_core',
	'desync-sounds',
  'oxmysql',
  'desync-map',
  'desync-status',
}
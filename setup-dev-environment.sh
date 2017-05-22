export npm_config_target=1.6.6
export npm_config_arch=$(node -e 'process.stdout.write(process.arch)')
export npm_config_target_arch=$(node -e 'process.stdout.write(process.arch)')
export npm_config_disturl=https://atom.io/download/electron
export npm_config_runtime=electron
#export npm_config_build_from_source=true
yarn

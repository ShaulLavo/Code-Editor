export const Neofetch = {
	osList: {
		windows: {
			names: ['Windows'],
			// @prettier-ignore start
			ascii: `[?25l[?7l[0m[36m[1m
################  ################
################  ################
################  ################
################  ################
################  ################
################  ################
################  ################

################  ################
################  ################
################  ################
################  ################
################  ################
################  ################
################  ################[0m
[16A[9999999D
[?25h[?7h`
			// @prettier-ignore end
		}, // Don't bother detecting different Windows versions, show them all as win11 for now (Would accept PR)
		chrome: {
			names: ['Chrome', 'Chrome OS'],
			// @prettier-ignore start
			ascii: `[?25l[?7l[0m[31m[1m            .,:loool:,.
        .,coooooooooooooc,.
     .,lllllllllllllllllllll,.
    ;ccccccccccccccccccccccccc;
[0m[32m[1m  '[0m[31m[1mccccccccccccccccccccccccccccc.
[0m[32m[1m ,oo[0m[31m[1mc::::::::okO[37m[0m[1m000[0m[33m[1m0OOkkkkkkkkkkk:
[0m[32m[1m.ooool[0m[31m[1m;;;;:x[37m[0m[1mK0[0m[34m[1mkxxxxxk[37m[0m[1m0X[0m[33m[1mK0000000000.
[0m[32m[1m:oooool[0m[31m[1m;,;O[37m[0m[1mK[0m[34m[1mddddddddddd[37m[0m[1mKX[0m[33m[1m000000000d
[0m[32m[1mlllllool[0m[31m[1m;l[37m[0m[1mN[0m[34m[1mdllllllllllld[37m[0m[1mN[0m[33m[1mK000000000
[0m[32m[1mlllllllll[0m[31m[1mo[37m[0m[1mM[0m[34m[1mdccccccccccco[37m[0m[1mW[0m[33m[1mK000000000
[0m[32m[1m;cllllllllX[37m[0m[1mX[0m[34m[1mc:::::::::c[37m[0m[1m0X[0m[33m[1m000000000d
[0m[32m[1m.ccccllllllO[37m[0m[1mNk[0m[34m[1mc;,,,;cx[37m[0m[1mKK[0m[33m[1m0000000000.
[0m[32m[1m .cccccclllllxOO[37m[0m[1mOOO[0m[32m[1mOkx[0m[33m[1mO0000000000;
[0m[32m[1m  .:ccccccccllllllllo[0m[33m[1mO0000000OOO,
[0m[32m[1m    ,:ccccccccclllcd[0m[33m[1m0000OOOOOOl.
[0m[32m[1m      '::ccccccccc[0m[33m[1mdOOOOOOOkx:.
[0m[32m[1m        ..,::cccc[0m[33m[1mxOOOkkko;.
[0m[32m[1m            ..,:[0m[33m[1mdOkxl:.[0m
[18A[9999999D
[?25h[?7h`
			// @prettier-ignore end
		},
		linux: {
			names: ['Linux'],
			// @prettier-ignore start
			ascii: `[?25l[?7l[38;5;8m[1m        #####
[38;5;8m[1m       #######
[38;5;8m[1m       ##[37m[0m[1mO[38;5;8m[1m#[37m[0m[1mO[38;5;8m[1m##
[38;5;8m[1m       #[0m[33m[1m#####[38;5;8m[1m#
[38;5;8m[1m     ##[37m[0m[1m##[0m[33m[1m###[37m[0m[1m##[38;5;8m[1m##
[38;5;8m[1m    #[37m[0m[1m##########[38;5;8m[1m##
[38;5;8m[1m   #[37m[0m[1m############[38;5;8m[1m##
[38;5;8m[1m   #[37m[0m[1m############[38;5;8m[1m###
[0m[33m[1m  ##[38;5;8m[1m#[37m[0m[1m###########[38;5;8m[1m##[0m[33m[1m#
[0m[33m[1m######[38;5;8m[1m#[37m[0m[1m#######[38;5;8m[1m#[0m[33m[1m######
[0m[33m[1m#######[38;5;8m[1m#[37m[0m[1m#####[38;5;8m[1m#[0m[33m[1m#######
[0m[33m[1m  #####[38;5;8m[1m#######[0m[33m[1m#####[0m
[12A[9999999D
[?25h[?7h`
			// @prettier-ignore end
		},
		mac: {
			names: ['Mac', 'iOS'],
			// @prettier-ignore start
			ascii: `[?25l[?7l[0m[32m[1m                    c.'
                 ,xNMM.
               .OMMMMo
               lMM"
     .;loddo:.  .olloddol;.
   cKMMMMMMMMMMNWMMMMMMMMMM0:
[0m[33m[1m .KMMMMMMMMMMMMMMMMMMMMMMMWd.
 XMMMMMMMMMMMMMMMMMMMMMMMX.
[0m[31m[1m;MMMMMMMMMMMMMMMMMMMMMMMM:
:MMMMMMMMMMMMMMMMMMMMMMMM:
[0m[31m[1m.MMMMMMMMMMMMMMMMMMMMMMMMX.
 kMMMMMMMMMMMMMMMMMMMMMMMMWd.
 [0m[35m[1m'XMMMMMMMMMMMMMMMMMMMMMMMMMMk
  'XMMMMMMMMMMMMMMMMMMMMMMMMK.
    [0m[34m[1mkMMMMMMMMMMMMMMMMMMMMMMd
     ;KMMMMMMMWXXWMMMMMMMk.
       "cooc*"    "*coo'"[0m
[17A[9999999D
[?25h[?7h`
			// @prettier-ignore end
		},
		unknown: {
			names: ['Unknown'],
			// @prettier-ignore start
			ascii: `?`
			// @prettier-ignore end
		}
	},
	// <<<<<<< main,
	getASCII(name: string, cfg: { lineEnding: string }): string | undefined {
		for (let key in Neofetch.osList) {
			const osKey = Object.keys(this.osList).find(key =>
				this.osList[key as keyof typeof this.osList].names.includes(name)
			)

			if (osKey) {
				return this.osList[osKey as keyof typeof this.osList].ascii.replace(
					/\n/g,
					cfg.lineEnding
				)
			}
		}
	},
	fixAnsi(input: string): string {
		const ansiRegex = new RegExp(
			[
				'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
				'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
			].join('|'),
			'g'
		)
		return input.replace(ansiRegex, '')
	},

	getData(opts?: {
		os?: string
		browser?: string
		lineEnding?: string
		allowColor?: boolean
	}): string {
		const environment = detectEnvironment()
		const cfg = {
			os: environment.os,
			browser: environment.browser,
			lineEnding: '\n',
			allowColor: false,
			...opts
		}

		let output = `Icon:${cfg.lineEnding}${this.getASCII(cfg.os, cfg)}${cfg.lineEnding}`

		if (cfg.browser === 'Chrome' && cfg.os === 'Unknown') {
			output += `Icon:${cfg.lineEnding}${this.getASCII(cfg.browser, cfg)}${cfg.lineEnding}${cfg.lineEnding}We didn't have your OS icon, so we used your browser icon instead.${cfg.lineEnding}`
		}

		if (!cfg.allowColor) {
			output = this.fixAnsi(output)
		}

		return output
	}
}

function detectEnvironment() {
	let os = 'Unknown'
	let browser = 'Unknown'

	if (typeof window === 'object' && window instanceof Window) {
		const { platform, userAgent, vendor } = navigator

		if (platform === 'Win32') os = 'Windows'
		if (platform?.startsWith('Linux')) os = 'Linux'
		if (userAgent?.includes('CrOS')) os = 'Chrome OS'
		if (userAgent?.includes('Macintosh') || userAgent?.includes('Mac OS'))
			os = 'Mac'
		if (userAgent?.includes('iPhone OS') || userAgent?.includes('iPad'))
			os = 'Mac'

		if (vendor === 'Google Inc.') {
			browser = 'Chrome'
		} else if (userAgent?.includes('Firefox')) {
			browser = 'Firefox'
		} else if (
			userAgent?.includes('Safari') &&
			!userAgent?.includes('Chrome')
		) {
			browser = 'Safari'
		} else if (userAgent?.includes('Edg')) {
			browser = 'Edge'
		} else if (userAgent?.includes('OPR') || userAgent?.includes('Opera')) {
			browser = 'Opera'
		} else if (userAgent?.includes('Trident')) {
			browser = 'Internet Explorer'
		}
	}

	return { os, browser }
}

// Example usage:

import css from '~/assets/icons/css.svg'
import docker from '~/assets/icons/docker.svg'
import html from '~/assets/icons/html.svg'
import java from '~/assets/icons/java.svg'
import javascript from '~/assets/icons/javascript.svg'
import json from '~/assets/icons/json.svg'
import php from '~/assets/icons/php.svg'
import python from '~/assets/icons/python.svg'
import react from '~/assets/icons/react.svg'
import react_ts from '~/assets/icons/react_ts.svg'
import ruby from '~/assets/icons/ruby.svg'
import sass from '~/assets/icons/sass.svg'
import typescript from '~/assets/icons/typescript.svg'
import xml from '~/assets/icons/xml.svg'
import yaml from '~/assets/icons/yaml.svg'
// import shell from '~/assets/icons/shell.svg'
import cpp from '~/assets/icons/cpp.svg'
import csharp from '~/assets/icons/csharp.svg'
import documentIcon from '~/assets/icons/document.svg'
import folder_base_open from '~/assets/icons/folder-base-open.svg'
import folder_base from '~/assets/icons/folder-base.svg'
import git from '~/assets/icons/git.svg'
import go from '~/assets/icons/go.svg'
import image from '~/assets/icons/image.svg'
import markdown from '~/assets/icons/markdown.svg'
import perl from '~/assets/icons/perl.svg'
import rust from '~/assets/icons/rust.svg'
import swift from '~/assets/icons/swift.svg'
import typescript_def from '~/assets/icons/typescript-def.svg'

export const fileExtIconMap = {
	tsx: react_ts,
	jsx: react,
	ts: typescript,
	js: javascript,
	py: python,
	rb: ruby,
	java: java,
	php: php,
	html: html,
	css: css,
	scss: sass,
	json: json,
	xml: xml,
	yaml: yaml,
	dockerfile: docker,
	// sh: shell,
	'd.ts': typescript_def,
	cpp: cpp,
	cs: csharp,
	go: go,
	rs: rust,
	pl: perl,
	md: markdown,
	swift: swift,
	gitignore: git,
	documentIcon,
	png: image,
	jpg: image,
	jpeg: image,
	svg: image,
	gif: image,
	webp: image,
	ico: image,
	bmp: image,
	tiff: image,
	tif: image,
	heic: image,
	heif: image
}

export const dirNameIconMap = {
	base: folder_base,
	'base-open': folder_base_open
}

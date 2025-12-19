/**
 * 通用的语言模块映射类型，表示可以嵌套的对象结构
 */
interface LanguageModule<T> {
	[key: string]: T | any
}

/**
 * 语言文件的参数类型，用于描述导入的语言文件集合
 */
type LanguageFileMap = Record<string, LanguageModule<LanguageFileMap>>;

export function getZhCnLang() {
	const langFiles = import.meta.glob<LanguageFileMap>("./zh-CN/**/*.json", {
		import: "default",
		eager: true,
	});
	const result = organizeLanguageFiles(langFiles);
	return result;
}

export function getEnUsLang() {
	const langFiles = import.meta.glob<LanguageFileMap>("./en-US/**/*.json", {
		import: "default",
		eager: true,
	});
	const result = organizeLanguageFiles(langFiles);
	return result;
}

export function getViVnLang() {
	const langFiles = import.meta.glob<LanguageFileMap>("./vi-VN/**/*.json", {
		import: "default",
		eager: true,
	});
	const result = organizeLanguageFiles(langFiles);
	return result;
}

export function organizeLanguageFiles(files: LanguageFileMap) {
  const result: LanguageModule<LanguageFileMap> = {};

  for (const path in files) {
    const content = files[path];

    // ./vi-VN/common/button.json → ["common", "button"]
    const match = path.match(/\/(vi-VN|en-US|zh-CN)\/(.*)\.json$/);
    if (!match) continue;

    const keyPath = match[2].split("/"); // ["common", "button"]

    let current = result;
    for (let i = 0; i < keyPath.length; i++) {
      const key = keyPath[i];
      if (i === keyPath.length - 1) {
        current[key] = content;
      } else {
        current[key] = current[key] || {};
        current = current[key];
      }
    }
  }

  return result;
}

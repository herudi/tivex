import fs from 'node:fs';
import path from 'node:path';
import { green, red, reset, yellow } from 'kolorist';
import { fileURLToPath } from 'node:url';
import minimist from 'minimist';
import prompts from 'prompts';

const VERSION = 'latest';

const templates = [
  {
    name: 'basic',
    display: 'Basic App',
  },
];

const LANG_LIST = [
  {
    name: 'typescript',
    display: 'Typescript (recommended)',
    templates: templates,
  },
  {
    name: 'javascript',
    display: 'Javascript',
    templates: templates,
  },
];

const LANGS = LANG_LIST.map(
  (f) => (f.templates && f.templates.map((v) => v.name)) || [f.name]
).reduce((a, b) => a.concat(b), []);
const renameFiles = {
  _gitignore: '.gitignore',
};

const defaultTargetDir = 'tivex-app';

function formatTargetDir(targetDir) {
  return targetDir?.trim().replace(/\/+$/g, '');
}

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function isEmpty(path) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === '.git');
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === '.git') {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

const packageName = 'package.json';

function editFile(file, callback) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    fs.writeFileSync(file, callback(content), 'utf-8');
  }
}

export async function createProject(param, cwd) {
  const argv = minimist(param.slice(2), { string: ['_'] });
  const argTargetDir = formatTargetDir(argv._[0]);
  const argTemplate = argv.template || argv.t;
  let targetDir = argTargetDir || defaultTargetDir;
  let result;
  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : 'text',
          name: 'projectName',
          message: reset('Project name:'),
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir;
          },
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
          name: 'overwrite',
          message: () =>
            (targetDir === '.'
              ? 'Current directory'
              : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`,
        },
        {
          type: (_, { overwrite }) => {
            if (overwrite === false) {
              throw new Error(red('✖') + ' Operation cancelled');
            }
            return null;
          },
          name: 'overwriteChecker',
        },
        {
          type: argTemplate && LANGS.includes(argTemplate) ? null : 'select',
          name: 'language',
          message:
            typeof argTemplate === 'string' && !LANGS.includes(argTemplate)
              ? reset(
                  `"${argTemplate}" isn't a valid template. Please choose from below: `
                )
              : reset('Select a language:'),
          initial: 0,
          choices: LANG_LIST.map((lang) => {
            return {
              title: yellow(lang.display || lang.name),
              value: lang,
            };
          }),
        },
        {
          type: (lang) => (lang && lang.templates ? 'select' : null),
          name: 'variant',
          message: reset('Select a template:'),
          choices: (lang) =>
            lang.templates.map((variant) => {
              return {
                title: green(variant.display || variant.name),
                value: variant.name,
              };
            }),
        },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled');
        },
      }
    );
  } catch (cancelled) {
    console.log(cancelled.message);
    return;
  }

  // user choice associated with prompts
  const { language, overwrite, variant } = result;
  const root = path.join(cwd, targetDir);
  if (overwrite) {
    emptyDir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }
  // determine template
  let template = variant || language?.name || argTemplate;
  console.log(`\nScaffolding project in ${root}...`);
  const langName = language?.name ?? 'typescript';
  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../..',
    `${langName}/${template}`
  );
  const write = (file, content) => {
    const targetPath = path.join(root, renameFiles[file] ?? file);
    if (content) {
      fs.writeFileSync(targetPath, content);
    } else {
      copy(path.join(templateDir, file), targetPath);
    }
  };
  const files = fs.readdirSync(templateDir);
  for (const file of files) write(file);
  editFile(path.resolve(root, packageName), (content) => {
    return content.replace(/\<VERSION\>/g, VERSION);
  });
  const cdProjectName = path.relative(cwd, root);
  if (root !== cwd) {
    console.log(
      `  cd ${
        cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
      }`
    );
  }
  console.log(`  npm install`);
  console.log(`  npm run dev`);
  console.log(`  npm run build`);
  console.log(`  npm run preview`);
}

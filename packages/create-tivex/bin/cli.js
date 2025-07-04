import { createProject } from './create.js';

createProject(process.argv, process.cwd()).catch(console.error);

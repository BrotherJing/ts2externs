import { Project } from 'ts-simple-ast';

const project = new Project({ 
    compilerOptions: { 
        outDir: ".", 
        declaration: false 
    }
});
project.addExistingSourceFiles('/Users/jing/Documents/js/material-ui-master/packages/material-ui/src/**/*.d.ts');
project.resolveSourceFileDependencies();

const sourceFiles = project.getSourceFiles();

const externsFile = project.createSourceFile('externs.d.ts', '');

sourceFiles.forEach(file => {
    let interfaces = file.getInterfaces();
    interfaces.forEach(i => {
        let properties = i.getProperties();
        externsFile.addStatements(writer => {
            writer.write(`var ${i.getName()} = `).block(() => {
                for (let p of properties) {
                    writer.writeLine(`${p.getName()}: null,`);
                }
            });
        });
    });
});

externsFile.save();

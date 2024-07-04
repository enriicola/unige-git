package unige.assessor;

import java.io.*;
import java.nio.file.*;
// import java.util.List;

import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;

import com.github.javaparser.symbolsolver.JavaSymbolSolver;
import com.github.javaparser.symbolsolver.resolution.typesolvers.CombinedTypeSolver;
import com.github.javaparser.symbolsolver.resolution.typesolvers.ReflectionTypeSolver;

public class AssessorTool {

	public static void main(String[] args) throws IOException{
		boolean normalize = false;
		String poPrefix = "";

		String inputDir = args[0];
		String outputDir = inputDir+"/Output/";
	
		File[] matchingFiles = searchFilesToAnalyze(inputDir);
		
		TreeDecomposer selDecomposer =  new TreeDecomposer(normalize,poPrefix);
		
		for(File file : matchingFiles) {
			CompilationUnit compilationUnit = recoverCompilationUnit(file);			
			selDecomposer.analyzeCompilationUnit(compilationUnit);	
		}
		
		writeNewClass(outputDir, selDecomposer);
		
		writeLogs(outputDir, selDecomposer);
		System.out.println("Refactoring complete");
	}

	private static void writeLogs(String outputDir, TreeDecomposer selDecomposer) throws IOException {
		if(selDecomposer.getLogs().size()>0) {				
			FileWriter writer = new FileWriter(outputDir+"logs.txt");
			for(String row : selDecomposer.getLogs()) 
				writer.write(row+"\n");			
			
			writer.close();
			System.out.println("Logs generated");
		}
	}

	private static void writeNewClass(String outputDir, TreeDecomposer selDecomposer) throws IOException {
		final String poDirectory = "PO/";
		File directory = new File(outputDir+poDirectory);
		if (!directory.exists())
			directory.mkdirs();
			
		for(CompilationUnit unit : selDecomposer.getUnits()) {
			ClassOrInterfaceDeclaration classToWrite = unit.findFirst(ClassOrInterfaceDeclaration.class).get();
			String fileDirectory = outputDir;
			if(unit!=selDecomposer.getTestSuiteUnit())
				fileDirectory+=poDirectory;
		
			FileWriter writer = new FileWriter(fileDirectory+classToWrite.getNameAsString()+".java");
			writer.write(unit.toString());
			writer.close();
		}
	}

	private static File[] searchFilesToAnalyze(String inputDir) {
		File dir = new File(inputDir);
		
		File[] matchingFiles = dir.listFiles(new FilenameFilter() {
			public boolean accept(File dir, String fileName) {
				return fileName.contains(".java");
			}		
		});
		return matchingFiles;
	}
	
	private static CompilationUnit recoverCompilationUnit(File file) throws IOException {
		// Set up a minimal type solver that only looks at the classes used to run this sample.
		CombinedTypeSolver combinedTypeSolver = new CombinedTypeSolver();
		combinedTypeSolver.add(new ReflectionTypeSolver());

		// Configure JavaParser to use type resolution
		JavaSymbolSolver symbolSolver = new JavaSymbolSolver(combinedTypeSolver);
		StaticJavaParser.getConfiguration().setSymbolResolver(symbolSolver);
		String fileText = new String();
		for (String line : Files.readString(Path.of(file.getAbsolutePath())).split("\n")) {
			if(line.trim().startsWith("public void") && Character.isDigit(line.trim().split(" ")[2].charAt(0)) ) 
				line = line.replaceFirst("[0-9]+", "");	

			fileText+=line+"\n";
		}

		// Parse some code
		return StaticJavaParser.parse(fileText);
	}
}

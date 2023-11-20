const brain = require('brain.js');
const sharp = require('sharp');
const { promises: fsPromises } = require('fs');
const Chance = require('chance');

class FuturisticImageGenerator {
  constructor() {
    this.model = this.createModel();
  }

  createModel() {
    return new brain.NeuralNetwork({
      hiddenLayers: [200, 300, 500, 400, 200, 100],
    });
  }

  generateRandomData() {
    const chance = new Chance();
    return {
      input: Array.from({ length: 3 }, () => chance.floating()),
      output: Array.from({ length: 3 }, () => chance.floating()),
      metadata: {
        title: chance.sentence(),
        description: chance.paragraph(),
      },
    };
  }

  generateTrainingData(count) {
    return Array.from({ length: count }, this.generateRandomData.bind(this));
  }

  async trainModel(data, iterations = 20000) {
    const trainingData = this.formatTrainingData(data);
    await this.model.trainAsync(trainingData, {
      iterations,
      log: true,
      logPeriod: 1000,
      learningRate: 0.01,
    });
  }

  formatTrainingData(data) {
    return data.map(({ input, output }) => ({ input, output }));
  }

  mapOutputToIntensity(output) {
    return output.map(value => Math.floor(value * 255));
  }

  createImageConfig(redIntensity, greenIntensity, blueIntensity) {
    return {
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: {
          r: redIntensity,
          g: greenIntensity,
          b: blueIntensity
        },
      },
    };
  }
  
  async generateAndSaveImage(output, outputPath) {
    const [redIntensity, greenIntensity, blueIntensity] = this.mapOutputToIntensity(output);
    const imageConfig = this.createImageConfig(redIntensity, greenIntensity, blueIntensity);
  
    try {
      const imageBuffer = await sharp(imageConfig)
        .png()
        .toBuffer();
  
      await fsPromises.writeFile(outputPath, imageBuffer);
      console.log(`Imagem gerada e salva em: ${outputPath}`);
    } catch (error) {
      console.error(`Erro ao gerar e salvar a imagem: ${error.message}`);
    }
  }

  async generateRandomImageData(count) {
    // Generate and train the model with random training data
    const trainingData = this.generateTrainingData(20);
    await this.trainModel(trainingData);
  
    // Generate and save random images using the trained model
    for (let i = 1; i <= count; i++) {
      const inputToGenerate = this.generateRandomData().input;
      const generatedOutput = this.model.run(inputToGenerate);
      const outputPath = this.generateImagePath(i);
  
      // Generate and save the image
      await this.generateAndSaveImage(generatedOutput, outputPath);
  
      // Print information about the generated image
      this.printGeneratedInfo(i, inputToGenerate, generatedOutput, outputPath);
    }
  }

  generateImagePath(index) {
    const timestamp = Date.now();
    return `./imagens/generated_image_${timestamp}_${index}.png`;
  }
  
  printGeneratedInfo(index, input, output, outputPath) {
    console.log(`Entrada #${index}:`, input);
    console.log(`Saída gerada #${index}:`, output);
    console.log(`Imagem gerada e salva em: ${outputPath}`);
  }
  
  generateOutputProbability(input) {
    return this.model.run(input);
  }
  
  async saveModelToFile(filePath) {
    const modelJson = this.model.toJSON();
    await fsPromises.writeFile(filePath, JSON.stringify(modelJson, null, 2));
    console.log(`Modelo salvo em: ${filePath}`);
  }
  
  async loadModelFromFile(filePath) {
    try {
      const modelJson = await fsPromises.readFile(filePath, 'utf-8');
      this.model.fromJSON(JSON.parse(modelJson));
      console.log(`Modelo carregado de: ${filePath}`);
    } catch (error) {
      console.error(`Erro ao carregar o modelo de ${filePath}: ${error.message}`);
    }
  }
}

async function main() {
  try {
    const imageGenerator = new FuturisticImageGenerator();

    // Generate and save random images
    await imageGenerator.generateRandomImageData(3);

    // Generate output probability for a specific input
    const inputForProbability = [0.5, 0.3, 0.8];
    const outputProbability = imageGenerator.generateOutputProbability(inputForProbability);
    console.log('Probabilidade de saída para a entrada:', outputProbability);

    // Save the trained model to a file
    const modelSavePath = './model_saved.json';
    await imageGenerator.saveModelToFile(modelSavePath);
    console.log(`Modelo salvo em: ${modelSavePath}`);

    // Create a new image generator and load the saved model
    const newImageGenerator = new FuturisticImageGenerator();
    await newImageGenerator.loadModelFromFile(modelSavePath);

    // Generate and save more random images using the loaded model
    await newImageGenerator.generateRandomImageData(2);
  } catch (error) {
    console.error('Erro durante a execução:', error);
  }
}

main();
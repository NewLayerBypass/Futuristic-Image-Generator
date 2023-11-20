**Futuristic Image Generator**

Este é um projeto simples de geração de imagens futurísticas utilizando uma rede neural implementada com a biblioteca `brain.js`. O código está estruturado em uma classe chamada `FuturisticImageGenerator` que encapsula todas as funcionalidades necessárias para treinar um modelo, gerar imagens aleatórias e salvar/carregar o modelo treinado.

**Como Usar**

Instalação de Dependências:
Certifique-se de ter as dependências instaladas usando o seguinte comando:

```
npm install
```

**Treinamento do Modelo:**

O modelo é treinado automaticamente ao instanciar a classe `FuturisticImageGenerator`. Os parâmetros de treinamento, como número de iterações e taxa de aprendizado, podem ser ajustados no método trainModel.

**Geração de Imagens Aleatórias:**

Para gerar imagens aleatórias, utilize o método `generateRandomImageData(count)`. Este método usa o modelo treinado para produzir saídas e salvar as imagens geradas no diretório `./imagens/`.

**Probabilidade de Saída para uma Entrada Específica:**

Se você deseja obter a probabilidade de saída para uma entrada específica, utilize o método `generateOutputProbability(input)`.

**Salvar e Carregar o Modelo:**

O modelo treinado pode ser salvo em um arquivo JSON usando o método `saveModelToFile(filePath)`. Da mesma forma, você pode carregar um modelo previamente treinado a partir de um arquivo usando `loadModelFromFile(filePath)`.

**Exemplo de Uso**
```js
const imageGenerator = new FuturisticImageGenerator();

// Treinar o modelo e gerar imagens aleatórias
await imageGenerator.generateRandomImageData(3);

// Obter a probabilidade de saída para uma entrada específica
const inputForProbability = [0.5, 0.3, 0.8];
const outputProbability = imageGenerator.generateOutputProbability(inputForProbability);
console.log('Probabilidade de saída para a entrada:', outputProbability);

// Salvar o modelo treinado em um arquivo
const modelSavePath = './model_saved.json';
await imageGenerator.saveModelToFile(modelSavePath);
console.log(`Modelo salvo em: ${modelSavePath}`);

// Criar um novo gerador de imagens e carregar o modelo treinado
const newImageGenerator = new FuturisticImageGenerator();
await newImageGenerator.loadModelFromFile(modelSavePath);

// Gerar mais imagens aleatórias usando o modelo carregado
await newImageGenerator.generateRandomImageData(2);
```

**Estrutura do Projeto**

`FuturisticImageGenerator` (class): Encapsula todas as funcionalidades.
`./imagens/` (diretório): Armazena as imagens geradas.

**Contribuições**

Contribuições são bem-vindas! Sinta-se à vontade para abrir problemas (issues) ou enviar pull requests para melhorias no código.

**Por que eu opto por comentar em inglês?**

Me sinto mais confortável e espontâneo ao cometer tal ato. Peço que não me julguem por esta escolha. >:

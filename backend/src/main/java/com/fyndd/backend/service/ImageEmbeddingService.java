//package com.fyndd.backend.service;
//
//import jakarta.annotation.PostConstruct;
//import lombok.extern.slf4j.Slf4j;
//import org.datavec.image.loader.NativeImageLoader;
//import org.deeplearning4j.nn.api.OptimizationAlgorithm;
//import org.deeplearning4j.nn.conf.ComputationGraphConfiguration;
//import org.deeplearning4j.nn.conf.NeuralNetConfiguration;
//import org.deeplearning4j.nn.conf.inputs.InputType;
//import org.deeplearning4j.nn.conf.layers.*;
//import org.deeplearning4j.nn.graph.ComputationGraph;
//import org.deeplearning4j.nn.weights.WeightInit;
//import org.nd4j.linalg.activations.Activation;
//import org.nd4j.linalg.api.ndarray.INDArray;
//import org.nd4j.linalg.dataset.api.preprocessor.DataNormalization;
//import org.nd4j.linalg.dataset.api.preprocessor.ImagePreProcessingScaler;
//import org.nd4j.linalg.factory.Nd4j;
//import org.nd4j.linalg.learning.config.Adam;
//import org.nd4j.linalg.lossfunctions.LossFunctions;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import javax.imageio.ImageIO;
//import java.awt.*;
//import java.awt.image.BufferedImage;
//import java.net.URL;
//import java.util.ArrayList;
//import java.util.List;
//
///**
// * Ultra-lightweight image embedding service using a simple custom CNN
// * Perfect for t2.micro instances with minimal memory footprint
// */
//@Service
//@Slf4j
//public class ImageEmbeddingService {
//    private static final int INPUT_SIZE = 128; // Smaller input size for memory efficiency
//    private static final int CHANNELS = 3;
//    private static final int EMBEDDING_SIZE = 512; // Compact embedding size
//
//    private ComputationGraph model;
//    private DataNormalization preprocessor;
//
//    @PostConstruct
//    public void init() {
//        try {
//            log.info("Initializing ultra-lightweight custom CNN for image embeddings...");
//
//            // Build a very lightweight CNN architecture
//            ComputationGraphConfiguration config = new NeuralNetConfiguration.Builder()
//                    .optimizationAlgo(OptimizationAlgorithm.STOCHASTIC_GRADIENT_DESCENT)
//                    .updater(new Adam(0.001))
//                    .weightInit(WeightInit.XAVIER)
//                    .graphBuilder()
//                    .addInputs("input")
//
//                    // First conv block - 32 filters
//                    .addLayer("conv1", new ConvolutionLayer.Builder(5, 5)
//                            .nIn(CHANNELS)
//                            .nOut(32)
//                            .stride(2, 2)
//                            .padding(2, 2)
//                            .activation(Activation.RELU)
//                            .build(), "input")
//                    .addLayer("pool1", new SubsamplingLayer.Builder(SubsamplingLayer.PoolingType.MAX)
//                            .kernelSize(2, 2)
//                            .stride(2, 2)
//                            .build(), "conv1")
//
//                    // Second conv block - 64 filters
//                    .addLayer("conv2", new ConvolutionLayer.Builder(3, 3)
//                            .nOut(64)
//                            .stride(1, 1)
//                            .padding(1, 1)
//                            .activation(Activation.RELU)
//                            .build(), "pool1")
//                    .addLayer("pool2", new SubsamplingLayer.Builder(SubsamplingLayer.PoolingType.MAX)
//                            .kernelSize(2, 2)
//                            .stride(2, 2)
//                            .build(), "conv2")
//
//                    // Third conv block - 128 filters
//                    .addLayer("conv3", new ConvolutionLayer.Builder(3, 3)
//                            .nOut(128)
//                            .stride(1, 1)
//                            .padding(1, 1)
//                            .activation(Activation.RELU)
//                            .build(), "pool2")
//                    .addLayer("pool3", new SubsamplingLayer.Builder(SubsamplingLayer.PoolingType.MAX)
//                            .kernelSize(2, 2)
//                            .stride(2, 2)
//                            .build(), "conv3")
//
//                    // Global average pooling instead of flatten (reduces parameters significantly)
//                    .addLayer("gap", new GlobalPoolingLayer.Builder(PoolingType.AVG)
//                            .build(), "pool3")
//
//                    // Feature embedding layer
//                    .addLayer("embedding", new DenseLayer.Builder()
//                            .nOut(EMBEDDING_SIZE)
//                            .activation(Activation.RELU)
//                            .build(), "gap")
//
//                    // Output layer for feature extraction (not used for classification)
//                    .addLayer("output", new OutputLayer.Builder(LossFunctions.LossFunction.MSE)
//                            .nOut(EMBEDDING_SIZE)
//                            .activation(Activation.IDENTITY)
//                            .build(), "embedding")
//
//                    .setOutputs("output")
//                    .setInputTypes(InputType.convolutional(INPUT_SIZE, INPUT_SIZE, CHANNELS))
//                    .build();
//
//            this.model = new ComputationGraph(config);
//            this.model.init();
//
//            log.info("Custom CNN model initialized with {} parameters", model.numParams());
//
//            // Initialize random weights (since we're not using pre-trained weights)
//            // In a real scenario, you would load pre-trained weights or train the model
//            log.info("Model initialized with random weights. For production use, consider training or loading pre-trained weights.");
//
//            // Setup preprocessor
//            this.preprocessor = new ImagePreProcessingScaler(0, 1);
//
//            // Test model with dummy input
//            INDArray dummyInput = Nd4j.zeros(1, CHANNELS, INPUT_SIZE, INPUT_SIZE);
//            preprocessor.transform(dummyInput);
//            INDArray[] features = model.output(dummyInput);
//
//            log.info("Feature extraction output shape: {}", java.util.Arrays.toString(features[0].shape()));
//            log.info("Feature vector length: {}", features[0].length());
//
//            logMemoryUsage("After model initialization");
//
//            log.info("Ultra-lightweight image embedding model initialized successfully");
//
//        } catch (Exception e) {
//            log.error("Failed to initialize ultra-lightweight image embedding model", e);
//            throw new RuntimeException("Image embedding model initialization failed", e);
//        }
//    }
//
//    public List<Double> generateImageEmbeddings(String imageUrl) {
//        try {
//            log.debug("Generating embeddings for image URL: {}", imageUrl);
//
//            URL url = new URL(imageUrl);
//            BufferedImage image = ImageIO.read(url);
//
//            if (image == null) {
//                throw new RuntimeException("Failed to load image from URL: " + imageUrl);
//            }
//
//            return processImageToEmbeddings(image);
//
//        } catch (Exception e) {
//            log.error("Failed to generate image embeddings from URL: {}", imageUrl, e);
//            throw new RuntimeException("Image embedding generation failed", e);
//        }
//    }
//
//    public List<Double> generateImageEmbeddingsFromFile(MultipartFile file) {
//        try {
//            log.debug("Generating embeddings for uploaded file: {}", file.getOriginalFilename());
//
//            BufferedImage image = ImageIO.read(file.getInputStream());
//
//            if (image == null) {
//                throw new RuntimeException("Failed to load image from uploaded file");
//            }
//
//            return processImageToEmbeddings(image);
//
//        } catch (Exception e) {
//            log.error("Failed to generate image embeddings from file: {}", file.getOriginalFilename(), e);
//            throw new RuntimeException("Image embedding generation failed", e);
//        }
//    }
//
//    private List<Double> processImageToEmbeddings(BufferedImage originalImage) {
//        try {
//            // Resize and convert image
//            BufferedImage processedImage = preprocessImage(originalImage);
//
//            // Convert to INDArray
//            NativeImageLoader loader = new NativeImageLoader(INPUT_SIZE, INPUT_SIZE, CHANNELS);
//            INDArray imageArray = loader.asMatrix(processedImage);
//
//            // Apply preprocessing
//            preprocessor.transform(imageArray);
//
//            // Get features from the embedding layer (second-to-last layer)
//            INDArray[] output = model.output(imageArray);
//            INDArray features = output[0];
//
//            // L2 normalize features
//            double norm = features.norm2Number().doubleValue();
//            if (norm > 0) {
//                features = features.div(norm);
//            }
//
//            // Convert to List<Double>
//            List<Double> embeddings = new ArrayList<>();
//            for (int i = 0; i < features.length(); i++) {
//                embeddings.add(features.getDouble(i));
//            }
//
//            log.debug("Generated {} dimensional embedding vector", embeddings.size());
//            return embeddings;
//
//        } catch (Exception e) {
//            log.error("Failed to process image to embeddings", e);
//            throw new RuntimeException("Image processing failed", e);
//        }
//    }
//
//    private BufferedImage preprocessImage(BufferedImage originalImage) {
//        BufferedImage rgbImage = new BufferedImage(INPUT_SIZE, INPUT_SIZE, BufferedImage.TYPE_INT_RGB);
//        Graphics2D g2d = rgbImage.createGraphics();
//
//        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
//        g2d.setColor(Color.WHITE);
//        g2d.fillRect(0, 0, INPUT_SIZE, INPUT_SIZE);
//
//        // Simple resize without aspect ratio preservation for maximum speed
//        g2d.drawImage(originalImage, 0, 0, INPUT_SIZE, INPUT_SIZE, null);
//        g2d.dispose();
//
//        return rgbImage;
//    }
//
//    public double calculateSimilarity(List<Double> embedding1, List<Double> embedding2) {
//        if (embedding1.size() != embedding2.size()) {
//            throw new IllegalArgumentException("Embedding vectors must have the same size");
//        }
//
//        double dotProduct = 0.0;
//        for (int i = 0; i < embedding1.size(); i++) {
//            dotProduct += embedding1.get(i) * embedding2.get(i);
//        }
//
//        return dotProduct; // Since vectors are already normalized
//    }
//
//    private void logMemoryUsage(String context) {
//        Runtime runtime = Runtime.getRuntime();
//        long usedMemory = (runtime.totalMemory() - runtime.freeMemory()) / 1024 / 1024;
//        long totalMemory = runtime.totalMemory() / 1024 / 1024;
//        long maxMemory = runtime.maxMemory() / 1024 / 1024;
//
//        log.info("{} - Memory: {} MB used / {} MB total / {} MB max",
//                context, usedMemory, totalMemory, maxMemory);
//    }
//
//    public String getMemoryInfo() {
//        Runtime runtime = Runtime.getRuntime();
//        long totalMemory = runtime.totalMemory() / 1024 / 1024;
//        long freeMemory = runtime.freeMemory() / 1024 / 1024;
//        long usedMemory = totalMemory - freeMemory;
//        long maxMemory = runtime.maxMemory() / 1024 / 1024;
//
//        return String.format("Memory - Used: %d MB, Free: %d MB, Total: %d MB, Max: %d MB",
//                usedMemory, freeMemory, totalMemory, maxMemory);
//    }
//}
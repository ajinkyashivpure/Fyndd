package com.fyndd.backend.controller;

import com.fyndd.backend.model.Product;
import com.fyndd.backend.model.ProductDTO;
import com.fyndd.backend.repository.ProductRepository;
import com.fyndd.backend.service.ProductService;
import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    private final ProductRepository productRepository;

    public ProductController(ProductService productService, ProductRepository productRepository) {
        this.productService = productService;
        this.productRepository = productRepository;
    }

//    @PostMapping
//    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
//        return new ResponseEntity<>(productService.createProduct(product), HttpStatus.CREATED);
//    }

    @GetMapping("/search")
    public List<Document> semanticSearch(
            @RequestParam String query,
            @RequestParam(defaultValue = "20") int limit) {
        return productService.semanticSearch(query, limit);
    }

    @GetMapping("/hybrid-search")
    public List<Document> hybridSearch(
            @RequestParam String query,
            @RequestParam(defaultValue = "20") int limit) {
        return productService.hybridSearch(query, limit);
    }


    @GetMapping("/type/{type}")
    public List<Product> getProductsByType(@PathVariable String type) {
        return productRepository.findByType(type);
    }



    @GetMapping("/getId/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        System.out.println("i am in the getId method");

        if (optionalProduct.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found with id: " + id);
        }

        Product product = optionalProduct.get();

        ProductDTO dto = new ProductDTO(
                product.getTitle(),
                product.getPrice(),
                product.getUrl(),
                product.getImageUrl(),
                product.getDescription()
        );

        return ResponseEntity.ok(dto);
    }

//    @GetMapping("/image")
//    public ResponseEntity<List<Document>> imageSearch(
//            @RequestParam("image") MultipartFile imageFile,
//            @RequestParam(defaultValue = "10") int limit) {
//        if (imageFile.isEmpty()) {
//            return ResponseEntity.badRequest().build();
//        }
//
//        List<Document> results = productService.imageSearch(imageFile, limit);
//        return ResponseEntity.ok(results);
//    }




    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<Product> getProductById(@PathVariable String id) {
//        return ResponseEntity.ok(productService.getProductById(id));
//    }
////
//    @PutMapping("/{id}")
//    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product product) {
//        return ResponseEntity.ok(productService.updateProduct(id, product));
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }



//    @GetMapping("/category/{category}")
//    public ResponseEntity<List<Product>> getByCategory(@PathVariable String category) {
//        return ResponseEntity.ok(productService.searchByCategory(category));
//    }
//
//    @GetMapping("/brand/{brand}")
//    public ResponseEntity<List<Product>> getByBrand(@PathVariable String brand) {
//        return ResponseEntity.ok(productService.searchByBrand(brand));
//    }
}
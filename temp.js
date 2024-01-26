class MyConstructor {
    constructor() {
      this.started = false; // Flag to track if start has been called
  
      // Call start method from the constructor
      this.start();
    }
  
    async start() {
      this.started = true;
      console.log("Starting...");
  
      // Call build method from start
      await this.build();
    }
  
    async build() {
      console.log("Building...");
      // Your actual build logic goes here
    }
  }
  
  // Create an instance of the class and call other methods
  const instance = new MyConstructor();
 
  console.log(instance.started); // Will be true
  
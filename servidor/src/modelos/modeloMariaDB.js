class ReadingMariaDB {
    constructor(id, temperature, humidity, timestamp) {
      this.id = id;
      this.temperature = temperature;
      this.humidity = humidity;
      this.timestamp = timestamp;
    }
  }
  
  module.exports = ReadingMariaDB;
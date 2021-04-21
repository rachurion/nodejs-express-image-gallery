const uuid = require('uuid')

exports.ImageGallery = class ImageGallery {
  constructor(title, url, color, date) {
    this.id = uuid.v1();
    this.title = title;
    this.url = url;
    this.predominantColor = color;
    this.date = date;
  }

  static storedImages = new Array();

  static findImageById(id) {
    return this.storedImages.find( (image) => {
      return image.id == id
    })
  }

  static sortImagesByDate() {
    this.storedImages.sort(function (a, b) {
      if (a.date > b.date) {
        return 1;
      }
      if (a.date < b.date) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    return this.storedImages;
  }

  static getAllUrlFromStoredImages() {
    return this.storedImages.map((image) => {
      return image.url;
    })
  }

  static checkIfImageExists(url) {
    let allStoredURL = this.getAllUrlFromStoredImages();

    return allStoredURL.includes(url);
  }

  static addNewImageToDatabase(image) {
    this.storedImages.push(image);
  }

  static removeImageById(id) {
    this.storedImages = this.storedImages.filter((image) => {
      return id != image.id
    })

  }

  static updateImageById(id, title, date) {
    // buscar la foto identificada por 'id'
    // Utilizamos ES6 para el método find. Hay un return ímplicito!

    // substituir los valores title y date de dicho elemento

    const image = this.storedImages.find( image => image.id == id)
    image.title = title
    image.date = date
  }
}
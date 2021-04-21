const ImageGallery = require('../models/image').ImageGallery;

const get_image_colors = require('get-image-colors');

// helper function to extract the predominant color from a given structure
function extractPredominantColor(colors) {
    let firstColor = colors[0];
    return firstColor._rgb.slice(0, -1);
}

exports.deleteImage = (req, res) => {
    // recuperamos el id de la ruta dinámica
    const idImage = req.params.idImage;

    // eliminamos la imagen de la base de datos
    ImageGallery.removeImageById(idImage)

    // redirigimos al cliente a la lista de imagenes
    res.redirect('/')
}

exports.updateImage = (req, res) => {
    // renderizar la vista del formulario. Rellenar los campos del formulario con la información de la imagen que queremos actualizar. Ofrecer dos botones: Actualizar, Borrar.
    
    let idImage = req.params.idImage;
    let image = ImageGallery.findImageById(idImage)

    if (!image) {
        throw new Error('Image not found in server')
    }

    res.render('addNew', {
        error: false,
        path: '/add-new',
        image: image

    });
    // El botón de 'Enviar' del formulario pasará a ser 'Actualizar'. Tenemos que modificar el atributo 'action' del tag <form> para ofrecer un endpoint distino para actualizar la imagen. Alternativamente, podiamos usar el mismo endpoint, y que sea el controlar que se encargue de verificar si la imagen ya está en nuestra base de datos y lo que queramos en realidad sea actualizarla.
}

exports.getImages = (req, res, next) => {
    console.log(ImageGallery.sortImagesByDate())
    res.render('images', {
        images: ImageGallery.sortImagesByDate(),
        path: '/'
    });
};

exports.addImage = (req, res, next) => {
    res.render('addNew', {
        error: false,
        path: '/add-new',
        image: null

    });
};

exports.addImagePost = (req, res, next) => {
    const imageUrl = req.body.imageURL;
    const title = req.body.imageName;
    const date = req.body.date;
    const id = req.body.id

    // si la variable id está informada, significa que queremos editar la foto en vez de crear una nueva
    if (id) {
        ImageGallery.updateImageById(id, title, date)
        return res.redirect('/')
    }


    if (ImageGallery.checkIfImageExists(imageUrl)) {
        // res.render NO Termina la ejecucióndel JavaScript; tan solo devuelve información al cliente. 
        // Necesitamos la palabra 'return' para terminar de manera inmediata la ejecución del código
        return res.render('addNew', {
            error: `La URL ${imageUrl} ya existe en nuestra base de datos.`,
            path: '/add-new',
            image: null

        });
    }
    
    // La imagen NO existe en la base datos
    get_image_colors(imageUrl).then(colors => {
        // solo en este punto del código tenemos toda la información necesaria para crear la foto.

        const predominantColor = extractPredominantColor(colors);

        const newImage = new ImageGallery(title, imageUrl, predominantColor, date);
        
        ImageGallery.addNewImageToDatabase(newImage);
        return res.redirect('/');
    }).catch(error => {
        // Ahora tenemos un console.log; pero en el futuro
        // seria interesante guardar los errores en un fichero
        console.log("Error de conversión", error);
        return res.render('addNew', {
            error: `Ha ocurrido un error inesperado al subir la foto. Por favor, prueba con otra URL`,
            path: '/add-new',
            image: null

        });
    })
};
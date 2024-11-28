function enviarCorreoInicioMaternidad(email, emailLider, variablesPlantilla, imagenes,imagenesManager,tipoSolicitud,nombreColaborador) {

  if(tipoSolicitud == TIPO_INICIO_MATERNIDAD){
    console.log("EN enviarCorreoInicioMaternidad : ");
    //variables correo colaborador
    var emailPlantilla = HtmlService.createTemplateFromFile("CorreoMaternidad");
    emailPlantilla.nombre = variablesPlantilla.nombreConMayuscula;
    var htmlPlantillaBienvenida = emailPlantilla.evaluate().getContent();
    var asunto = `Bienvenida al programa de protección a la madre gestante`;

    // Enviar correo colaborador
    enviarCorreoHtmlConImagenCC(email, asunto, htmlPlantillaBienvenida, imagenes, emailLider);

    //variables correo lider
    var emailPlantilla = HtmlService.createTemplateFromFile("CorreoMaternidadManager");
    emailPlantilla.nombreManager = variablesPlantilla.nombreManagerMayuscula;
    emailPlantilla.nombre = variablesPlantilla.nombreConMayuscula;
    var htmlPlantillaBienvenida = emailPlantilla.evaluate().getContent();
    var asunto = `Programa de protección a la madre gestante - ` + nombreColaborador;

    // Enviar correo lider
    enviarCorreoSinCC(emailLider, asunto, htmlPlantillaBienvenida, imagenesManager);

  }
  else if(tipoSolicitud == TIPO_RECORDATORIO_LICENCIA){
    console.log("EN enviarCorreoRecordatorioLincencia : ");
    //variables correo colaborador
    var emailPlantilla = HtmlService.createTemplateFromFile("CorreoRecordatorioLicencia");
    emailPlantilla.nombre = variablesPlantilla.nombreColaboradoraConMayuscula;
    var htmlPlantillaBienvenida = emailPlantilla.evaluate().getContent();
    var asunto = `Recuerda realizar tu tramite de licencia por maternidad`;

    // Enviar correo colaborador
    enviarCorreoSinCCSubsidio(email, asunto, htmlPlantillaBienvenida, imagenes);
  }
  else if(tipoSolicitud == TIPO_REINGRESO_MATERNIDAD){
    console.log("EN enviarCorreoReingreso : ");
    //variables correo colaborador
    var emailPlantilla = HtmlService.createTemplateFromFile("ReingresoMaternidad");
    emailPlantilla.nombre = variablesPlantilla.nombreColaboradoraConMayuscula;
    var htmlPlantillaBienvenida = emailPlantilla.evaluate().getContent();
    var asunto = `¡Bienvenida de vuelta a BBVA! 🏢🎈`;
    var asuntoCodificado = "=?UTF-8?B?" + Utilities.base64Encode(Utilities.newBlob(asunto).getBytes()) + "?=";

    // Enviar correo colaborador
    enviarCorreoHtmlConImagenCC(email, asuntoCodificado, htmlPlantillaBienvenida, imagenes, emailLider);

    //variables correo lider
    var emailPlantilla = HtmlService.createTemplateFromFile("ReingresoMaternidadManager");
    emailPlantilla.nombreManager = variablesPlantilla.nombreManagerMayuscula;
    emailPlantilla.nombre = variablesPlantilla.nombreManagerMayuscula;
    var htmlPlantillaBienvenida = emailPlantilla.evaluate().getContent();
    var asunto = nombreColaborador + ` retorna al BBVA🎉💙`;
    var asuntoCodificado = "=?UTF-8?B?" + Utilities.base64Encode(Utilities.newBlob(asunto).getBytes()) + "?=";

    // Enviar correo lider
    enviarCorreoSinCC(emailLider, asuntoCodificado, htmlPlantillaBienvenida, imagenesManager);
  }
  else if(tipoSolicitud == TIPO_RECORDATORIOA_LLENAR_FECHA_REGRESO){
    //variables correo colaborador
    var emailPlantilla = HtmlService.createTemplateFromFile("RecordatorioRegistrarFecha");
    emailPlantilla.nombre = variablesPlantilla.nombreConMayuscula;
    var htmlPlantillaBienvenida = emailPlantilla.evaluate().getContent();
    var asunto = `Recordatorio programa de protección a la madre gestante`;
    // Enviar correo
    enviarCorreoSinCC(email, asunto, htmlPlantillaBienvenida, imagenes);

  }
}

function enviarCorreoHtmlConImagenCC(emailDestino, asunto, mensaje, imagenes, copia) {
  var options = {
    htmlBody: mensaje,
    inlineImages: imagenes,
    cc: copia,
    name: MAIL_SENDER_NAME,
    from: MAIL_SENDER_EMAIL
  };
  // Enviar correo por Gmail API
  GmailApp.sendEmail(emailDestino, asunto, mensaje, options);
}

function enviarCorreoSinCC(emailDestino, asunto, mensaje, imagenes) {
  var options = {
    htmlBody: mensaje,
    inlineImages: imagenes,
    name: MAIL_SENDER_NAME,
    from: MAIL_SENDER_EMAIL
  };
  // Enviar correo por Gmail API
  GmailApp.sendEmail(emailDestino, asunto, mensaje, options);
}

function enviarCorreoSinCCSubsidio(emailDestino, asunto, mensaje, imagenes) {
  var options = {
    htmlBody: mensaje,
    inlineImages: imagenes,
    name: MAIL_SENDER_NAME_SUBSIDIO,
    from: MAIL_SENDER_EMAIL_SUBSIDIO
  };
  // Enviar correo por Gmail API
  GmailApp.sendEmail(emailDestino, asunto, mensaje, options);
}

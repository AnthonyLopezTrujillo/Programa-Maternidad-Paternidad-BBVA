function envioRecordatoriosMaternidad(){
  correoRecordatorioIngresoFechaRegreso();
  enviarRecordatorioMaternidadSubsidio();
  enviarCorreoReingresoMaternidad();
}

/*
function enviarRecordatorioMaternidadSubsidio() {
  // Obtener todas las filas de la hoja
  var hojaMaternidadForm = SHEET_INGRESOS_MATERNIDAD;
  var datos = hojaMaternidadForm.getDataRange().getValues();

  // Obtener la fecha actual
  var fechaActual = new Date();
  fechaActual.setHours(0, 0, 0, 0);
  //console.log("fecha actual:: "+fechaActual);
  
  // Recorrer todas las filas de datos
  for (var i = 1; i < datos.length; i++) {

    var fila = datos[i];
    var fechaProbableParto = new Date(fila[FORM_DATOS_FECHA_PARTO_IDX]);
    fechaProbableParto.setHours(0, 0, 0, 0);
    fechaProbableParto.setDate(fechaProbableParto.getDate() - 60);
    fechaProbableParto.setHours(0, 0, 0, 0);

    //console.log("fechaProbableParto:: "+fechaProbableParto);
    var emailColaborador = fila[SHEET_DATOS_EMAIL_IDX];

    // Calcular la diferencia
    //var diasFechasDiferencia = (fechaProbableParto - fechaActual) / (1000 * 60 * 60 * 24);
    //var fechaReincorporacion = new Date(fila[FORM_DATOS_FECHA_RETORNO_IDX]);
    //fechaReincorporacion.setHours(0, 0, 0, 0); // Normalizar fechaReincorporacion

    // Si la diferencia es aproximadamente 60 días (dos meses), enviar un recordatorio
    if (fechaProbableParto.getTime() === fechaActual.getTime()) {
      var tipoSolicitud = TIPO_RECORDATORIO_LICENCIA;

      var nombreColaborador = fila[FORM_DATOS_NOMBRE_IDX]; // NOMBRES Y APELLIDOS en la columna D

      // Obtener datos colaboradora
      var itemColaborador = obtenerDatosDeEmpleadoPorEmail(emailColaborador);
      var emailLider = itemColaborador[SHEET_COLABORADOR_EMAIL_LIDER_IDX];
      var nombreColaborador = itemColaborador[SHEET_COLABORADOR_NOMBRES_APELLIDOS_IDX];
      var nombrePreferido = itemColaborador[SHEET_CAPACITY_NOMBRE_PREFERIDO_IDX];
      var nombresApellidosArray = nombreColaborador.split(", ");
      var nombreElegido = nombrePreferido == "" ? nombresApellidosArray[1] : nombrePreferido;


      //Nombres de colaboradora Final
      var nombreColaboradoraConMayuscula = convertirNombreAPrimeroMayuscula(nombreElegido);

      var imagenBanner = obtenerImagenDrive(IMAGEN_SUBSIDIO_RECORDATORIO);
      var variablesPlantilla = {
        nombreColaboradoraConMayuscula
      };

      var imagenes = {
        "banner": imagenBanner
      };

      var imagenesManager = {
        "bannerManager" : ""
      };

      console.log("enviarRecordatorioMaternidadSubsidio:: "+emailColaborador+" - "+emailLider);
      enviarCorreoInicioMaternidad(emailColaborador, emailLider, variablesPlantilla, imagenes,imagenesManager,tipoSolicitud,"");

      guardarLog(itemColaborador[SHEET_COLABORADOR_REGISTRO_IDX],emailColaborador,TIPO_RECORDATORIO_LICENCIA);

    }
  }
}


function enviarCorreoReingresoMaternidad() {
  var hojaPaternidad = SHEET_INGRESOS_MATERNIDAD;
  var datosHojaPaternidad = hojaPaternidad.getDataRange().getValues();
  
  var hojaFormReingreso = SHEET_INGRESOS_REINCORPORACION;
  var datosReingreso = hojaFormReingreso.getDataRange().getValues();

  // Crear un diccionario de registros a fechas de retorno
  var registroFechaRetornoMap = {};
  for (var j = 1; j < datosReingreso.length; j++) {
    var itemReingreso = datosReingreso[j];
    var registro = itemReingreso[SHEET_MATERNIDAD_REGISTRO_REINGRESO_IDX];
    var fechaRetorno = new Date(itemReingreso[FORM_DATOS_FECHA_REINGRESO_IDX]);
    fechaRetorno.setHours(0, 0, 0, 0);
    registroFechaRetornoMap[registro] = fechaRetorno;
    //console.log("fechaRetorno:: "+fechaRetorno);
  }

  // Obtener la fecha actual y normalizarla a solo año, mes y día
  var fechaActual = new Date();
  fechaActual.setHours(0, 0, 0, 0);

  // Recorrer todas las filas de datos
  for (var i = 1; i < datosHojaPaternidad.length; i++) {
    var itemHojaPaternidad = datosHojaPaternidad[i];
    var registro = itemHojaPaternidad[SHEET_MATERNIDAD_REGISTRO_IDX];

    if (registro in registroFechaRetornoMap) {
      var fechaReingreso = registroFechaRetornoMap[registro];
      //console.log("fechaReingreso:: "+fechaReingreso);
      if (fechaReingreso.getTime() === fechaActual.getTime()) {
        console.log("En hoja form ingreso de fecha retorno:: ")
        var tipoSolicitud = TIPO_REINGRESO_MATERNIDAD;
        var emailColaborador = itemHojaPaternidad[SHEET_DATOS_EMAIL_IDX];

        var itemColaborador = obtenerDatosDeEmpleadoPorEmail(emailColaborador);

        var nombreColaborador = itemColaborador[SHEET_COLABORADOR_NOMBRES_APELLIDOS_IDX];
        var nombrePreferido = itemColaborador[SHEET_CAPACITY_NOMBRE_PREFERIDO_IDX];
        var nombresApellidosArray = nombreColaborador.split(", ");
        var nombreElegido = nombrePreferido == "" ? nombresApellidosArray[1] : nombrePreferido;
        var nombreColaboradoraConMayuscula = convertirNombreAPrimeroMayuscula(nombreElegido);
        var emailLider =itemColaborador[SHEET_COLABORADOR_EMAIL_LIDER_IDX];

        // Obtener datos manager
        var itemManager = obtenerDatosDeManagerPorEmail(emailLider);
        var nombreLider = itemManager[SHEET_COLABORADOR_NOMBRES_APELLIDOS_IDX];
        var nombrePreferidoManager = itemManager[SHEET_CAPACITY_NOMBRE_PREFERIDO_IDX];
        var nombresApellidosArrayManager = nombreLider.split(", ");
        var nombreElegidoManager = nombrePreferidoManager == "" ? nombresApellidosArrayManager[1] : nombrePreferidoManager;
        var nombreManagerMayuscula = convertirNombreAPrimeroMayuscula(nombreElegidoManager);

        //conseguir imagenes
        var imagenBanner = obtenerImagenDrive(IMAGEN_REINGRESO_COLABORADORA);
        var managerBanner = obtenerImagenDrive(IMAGEN_REINGRESO_MANAGER_COLABORADORA);

        //agrupar nombres e imagenes
        var variablesPlantilla = {
          nombreColaboradoraConMayuscula,
          nombreManagerMayuscula
        };

        var imagenes = {
          "banner": imagenBanner
        };

        var imagenesManager = {
          "bannerManager" : managerBanner
        };
        console.log("enviarCorreoReingresoMaternidad:: "+emailColaborador+" - "+emailLider);
        enviarCorreoInicioMaternidad(emailColaborador, emailLider, variablesPlantilla, imagenes,imagenesManager,tipoSolicitud,nombreColaborador);

        guardarLog(itemColaborador[SHEET_COLABORADOR_REGISTRO_IDX],emailColaborador,TIPO_REINGRESO_MATERNIDAD);
      }
    } else {
      var fechaProbableParto = new Date(itemHojaPaternidad[FORM_DATOS_FECHA_PARTO_IDX]); 
      fechaProbableParto.setDate(fechaProbableParto.getDate() + 98);
      var fechaReingreso = new Date(fechaProbableParto);
      fechaReingreso.setHours(0, 0, 0, 0);

      //console.log(fechaReingreso);

      if (fechaReingreso.getTime() === fechaActual.getTime()) {
        console.log("fecha probable parto + 30dias :: ")

        var tipoSolicitud = TIPO_REINGRESO_MATERNIDAD;
        var emailColaborador = itemHojaPaternidad[SHEET_DATOS_EMAIL_IDX];

        var itemColaborador = obtenerDatosDeEmpleadoPorEmail(emailColaborador);

        var nombreColaborador = itemColaborador[SHEET_COLABORADOR_NOMBRES_APELLIDOS_IDX];
        var nombrePreferido = itemColaborador[SHEET_CAPACITY_NOMBRE_PREFERIDO_IDX];
        var nombresApellidosArray = nombreColaborador.split(", ");
        var nombreElegido = nombrePreferido == "" ? nombresApellidosArray[1] : nombrePreferido;
        var nombreColaboradoraConMayuscula = convertirNombreAPrimeroMayuscula(nombreElegido);
        var emailLider =itemColaborador[SHEET_COLABORADOR_EMAIL_LIDER_IDX];

        // Obtener datos manager
        var itemManager = obtenerDatosDeManagerPorEmail(emailLider);
        var nombreLider = itemManager[SHEET_COLABORADOR_NOMBRES_APELLIDOS_IDX];
        var nombrePreferidoManager = itemManager[SHEET_CAPACITY_NOMBRE_PREFERIDO_IDX];
        var nombresApellidosArrayManager = nombreLider.split(", ");
        var nombreElegidoManager = nombrePreferidoManager == "" ? nombresApellidosArrayManager[1] : nombrePreferidoManager;
        var nombreManagerMayuscula = convertirNombreAPrimeroMayuscula(nombreElegidoManager);

        //conseguir imagenes
        var imagenBanner = obtenerImagenDrive(IMAGEN_REINGRESO_COLABORADORA);
        var managerBanner = obtenerImagenDrive(IMAGEN_REINGRESO_MANAGER_COLABORADORA);

        //agrupar nombres e imagenes
        var variablesPlantilla = {
          nombreColaboradoraConMayuscula,
          nombreManagerMayuscula
        };

        var imagenes = {
          "banner": imagenBanner
        };

        var imagenesManager = {
          "bannerManager" : managerBanner
        };
        console.log("enviarCorreoReingresoMaternidad:: "+emailColaborador+" - "+emailLider);
        enviarCorreoInicioMaternidad(emailColaborador, emailLider, variablesPlantilla, imagenes,imagenesManager,tipoSolicitud,nombreColaborador);

        guardarLog(itemColaborador[SHEET_COLABORADOR_REGISTRO_IDX],emailColaborador,TIPO_REINGRESO_MATERNIDAD);
      }
    }
  }
}
*/

/**INI - ALT - 150724 */
function enviarCorreoReingresoMaternidad() {
  var hojaPaternidad = SHEET_INGRESOS_MATERNIDAD;
  var datosHojaPaternidad = hojaPaternidad.getDataRange().getValues();
  
  var hojaFormReingreso = SHEET_INGRESOS_REINCORPORACION;
  var datosReingreso = hojaFormReingreso.getDataRange().getValues();

  // Crear un diccionario de registros a fechas de retorno
  var registroFechaRetornoMap = {};
  for (var j = 1; j < datosReingreso.length; j++) {
    var itemReingreso = datosReingreso[j];
    var registro = itemReingreso[SHEET_MATERNIDAD_REGISTRO_REINGRESO_IDX];
    var fechaRetorno = new Date(itemReingreso[FORM_DATOS_FECHA_REINGRESO_IDX]);
    fechaRetorno.setHours(0, 0, 0, 0);
    registroFechaRetornoMap[registro] = fechaRetorno;
    //console.log("fechaRetorno:: "+fechaRetorno);
  }

  // Obtener la fecha actual y normalizarla a solo año, mes y día
  var fechaActual = new Date();
  fechaActual.setHours(0, 0, 0, 0);

  // Recorrer todas las filas de datos
  for (var i = 1; i < datosHojaPaternidad.length; i++) {
    var itemHojaPaternidad = datosHojaPaternidad[i];
    var registro = itemHojaPaternidad[SHEET_MATERNIDAD_REGISTRO_IDX];

    if (registro in registroFechaRetornoMap) {
      var fechaReingreso = registroFechaRetornoMap[registro];
      //console.log("fechaReingreso:: "+fechaReingreso);
      if (fechaReingreso.getTime() === fechaActual.getTime()) {
        try {
          var tipoSolicitud = TIPO_REINGRESO_MATERNIDAD;
          var emailColaborador = itemHojaPaternidad[SHEET_DATOS_EMAIL_IDX];

          var itemColaborador = obtenerDatosDeEmpleadoPorEmail(emailColaborador);
          if (!itemColaborador) {
            throw new Error("No se encontraron datos para el correo: " + emailColaborador);
          }

          var nombreColaborador = itemColaborador[SHEET_COLABORADOR_NOMBRES_APELLIDOS_IDX];
          var nombrePreferido = itemColaborador[SHEET_CAPACITY_NOMBRE_PREFERIDO_IDX];
          var nombresApellidosArray = nombreColaborador.split(", ");
          var nombreElegido = nombrePreferido == "" ? nombresApellidosArray[1] : nombrePreferido;
          var nombreColaboradoraConMayuscula = convertirNombreAPrimeroMayuscula(nombreElegido);
          var emailLider = itemColaborador[SHEET_COLABORADOR_EMAIL_LIDER_IDX];

          // Obtener datos manager
          var itemManager = obtenerDatosDeManagerPorEmail(emailLider);
          var nombreLider = itemManager[SHEET_COLABORADOR_NOMBRES_APELLIDOS_IDX];
          var nombrePreferidoManager = itemManager[SHEET_CAPACITY_NOMBRE_PREFERIDO_IDX];
          var nombresApellidosArrayManager = nombreLider.split(", ");
          var nombreElegidoManager = nombrePreferidoManager == "" ? nombresApellidosArrayManager[1] : nombrePreferidoManager;
          var nombreManagerMayuscula = convertirNombreAPrimeroMayuscula(nombreElegidoManager);

          // Conseguir imágenes
          var imagenBanner = obtenerImagenDrive(IMAGEN_REINGRESO_COLABORADORA);
          var managerBanner = obtenerImagenDrive(IMAGEN_REINGRESO_MANAGER_COLABORADORA);

          // Agrupar nombres e imágenes
          var variablesPlantilla = {
            nombreColaboradoraConMayuscula,
            nombreManagerMayuscula
          };

          var imagenes = {
            "banner": imagenBanner
          };

          var imagenesManager = {
            "bannerManager": managerBanner
          };
          console.log("enviarCorreoReingresoMaternidad:: " + emailColaborador + " - " + emailLider);
          enviarCorreoInicioMaternidad(emailColaborador, emailLider, variablesPlantilla, imagenes, imagenesManager, tipoSolicitud, nombreColaborador);

          guardarLog(itemColaborador[SHEET_COLABORADOR_REGISTRO_IDX], emailColaborador, TIPO_REINGRESO_MATERNIDAD);
        } catch (error) {
          console.error("Error procesando el reingreso de maternidad para el correo: " + emailColaborador + " - " + error.message);
        }
      }
    } else {
      var fechaProbableParto = new Date(itemHojaPaternidad[FORM_DATOS_FECHA_PARTO_IDX]); 
      fechaProbableParto.setDate(fechaProbableParto.getDate() + 98);
      var fechaReingreso = new Date(fechaProbableParto);
      fechaReingreso.setHours(0, 0, 0, 0);

      //console.log(fechaReingreso);

      if (fechaReingreso.getTime() === fechaActual.getTime()) {
        try {
          var tipoSolicitud = TIPO_REINGRESO_MATERNIDAD;
          var emailColaborador = itemHojaPaternidad[SHEET_DATOS_EMAIL_IDX];

          var itemColaborador = obtenerDatosDeEmpleadoPorEmail(emailColaborador);
          if (!itemColaborador) {
            throw new Error("No se encontraron datos para el correo: " + emailColaborador);
          }

          var nombreColaborador = itemColaborador[SHEET_COLABORADOR_NOMBRES_APELLIDOS_IDX];
          var nombrePreferido = itemColaborador[SHEET_CAPACITY_NOMBRE_PREFERIDO_IDX];
          var nombresApellidosArray = nombreColaborador.split(", ");
          var nombreElegido = nombrePreferido == "" ? nombresApellidosArray[1] : nombrePreferido;
          var nombreColaboradoraConMayuscula = convertirNombreAPrimeroMayuscula(nombreElegido);
          var emailLider = itemColaborador[SHEET_COLABORADOR_EMAIL_LIDER_IDX];

          // Obtener datos manager
          var itemManager = obtenerDatosDeManagerPorEmail(emailLider);
          var nombreLider = itemManager[SHEET_COLABORADOR_NOMBRES_APELLIDOS_IDX];
          var nombrePreferidoManager = itemManager[SHEET_CAPACITY_NOMBRE_PREFERIDO_IDX];
          var nombresApellidosArrayManager = nombreLider.split(", ");
          var nombreElegidoManager = nombrePreferidoManager == "" ? nombresApellidosArrayManager[1] : nombrePreferidoManager;
          var nombreManagerMayuscula = convertirNombreAPrimeroMayuscula(nombreElegidoManager);

          // Conseguir imágenes
          var imagenBanner = obtenerImagenDrive(IMAGEN_REINGRESO_COLABORADORA);
          var managerBanner = obtenerImagenDrive(IMAGEN_REINGRESO_MANAGER_COLABORADORA);

          // Agrupar nombres e imágenes
          var variablesPlantilla = {
            nombreColaboradoraConMayuscula,
            nombreManagerMayuscula
          };

          var imagenes = {
            "banner": imagenBanner
          };

          var imagenesManager = {
            "bannerManager": managerBanner
          };
          console.log("enviarCorreoReingresoMaternidad:: " + emailColaborador + " - " + emailLider);
          enviarCorreoInicioMaternidad(emailColaborador, emailLider, variablesPlantilla, imagenes, imagenesManager, tipoSolicitud, nombreColaborador);

          guardarLog(itemColaborador[SHEET_COLABORADOR_REGISTRO_IDX], emailColaborador, TIPO_REINGRESO_MATERNIDAD);
        } catch (error) {
          console.error("Error procesando el reingreso de maternidad para el correo: " + emailColaborador + " - " + error.message);
        }
      }
    }
  }
}


function enviarRecordatorioMaternidadSubsidio() {
  // Obtener todas las filas de la hoja
  var hojaMaternidadForm = SHEET_INGRESOS_MATERNIDAD;
  var datos = hojaMaternidadForm.getDataRange().getValues();

  // Obtener la fecha actual
  var fechaActual = new Date();
  fechaActual.setHours(0, 0, 0, 0);
  console.log("fecha actual:: " + fechaActual);

  // Obtener la imagen una vez fuera del bucle
  var imagenBanner = obtenerImagenDrive(IMAGEN_SUBSIDIO_RECORDATORIO);
  
  // Recorrer todas las filas de datos
  for (var i = 1; i < datos.length; i++) {
    var fila = datos[i];
    var fechaProbableParto = new Date(fila[FORM_DATOS_FECHA_PARTO_IDX]);
    fechaProbableParto.setHours(0, 0, 0, 0);
    fechaProbableParto.setDate(fechaProbableParto.getDate() - 60);
    fechaProbableParto.setHours(0, 0, 0, 0);

    console.log("fechaProbableParto:: " + fechaProbableParto);
    var emailColaborador = fila[SHEET_DATOS_EMAIL_IDX];

    // Si la diferencia es aproximadamente 60 días (dos meses), enviar un recordatorio
    if (fechaProbableParto.getTime() === fechaActual.getTime()) {
      try {
        var tipoSolicitud = TIPO_RECORDATORIO_LICENCIA;

        // Obtener datos colaboradora
        var itemColaborador = obtenerDatosDeEmpleadoPorEmail(emailColaborador);
        if (!itemColaborador) {
          throw new Error("No se encontraron datos para el correo: " + emailColaborador);
        }
        
        var emailLider = itemColaborador[SHEET_COLABORADOR_EMAIL_LIDER_IDX];
        var nombreColaborador = itemColaborador[SHEET_COLABORADOR_NOMBRES_APELLIDOS_IDX];
        var nombrePreferido = itemColaborador[SHEET_CAPACITY_NOMBRE_PREFERIDO_IDX];
        var nombresApellidosArray = nombreColaborador.split(", ");
        var nombreElegido = nombrePreferido == "" ? nombresApellidosArray[1] : nombrePreferido;

        // Nombres de colaboradora final
        var nombreColaboradoraConMayuscula = convertirNombreAPrimeroMayuscula(nombreElegido);

        var variablesPlantilla = {
          nombreColaboradoraConMayuscula
        };

        var imagenes = {
          "banner": imagenBanner
        };

        var imagenesManager = {
          "bannerManager": ""
        };

        enviarCorreoInicioMaternidad(emailColaborador, emailLider, variablesPlantilla, imagenes, imagenesManager, tipoSolicitud, "");

        guardarLog(itemColaborador[SHEET_COLABORADOR_REGISTRO_IDX], emailColaborador, TIPO_RECORDATORIO_LICENCIA);
      } catch (error) {
        console.error("Error procesando el recordatorio de maternidad para el correo: " + emailColaborador + " - " + error.message);
      }
    }
  }
}

function correoRecordatorioIngresoFechaRegreso() {
  var hojaPaternidad = SHEET_INGRESOS_MATERNIDAD;
  var datosHojaPaternidad = hojaPaternidad.getDataRange().getValues();
  var fechaActual = new Date();
  fechaActual.setHours(0, 0, 0, 0); // Aseguramos que solo comparamos la fecha, no la hora

  // Obtener la imagen una vez fuera del bucle
  var imagenBanner = obtenerImagenDrive(IMAGEN_RECORDATORIO_REGISTRAR_FECHA);

  for (var numFila = 1; numFila < datosHojaPaternidad.length; numFila++) {
    var itemHojaPaternidad = datosHojaPaternidad[numFila];
    var fechaProbableParto = new Date(itemHojaPaternidad[FORM_DATOS_FECHA_PARTO_IDX]);

    // Restar 30 días a la fecha de probable parto
    var fechaParto = new Date(fechaProbableParto);
    fechaParto.setDate(fechaParto.getDate() - 30);
    fechaParto.setHours(0, 0, 0, 0);

    if (fechaParto.getTime() === fechaActual.getTime()) {
      try {
        var tipoSolicitud = TIPO_RECORDATORIOA_LLENAR_FECHA_REGRESO;
        var emailColaborador = itemHojaPaternidad[SHEET_DATOS_EMAIL_IDX];

        var itemColaborador = obtenerDatosDeEmpleadoPorEmail(emailColaborador);
        if (!itemColaborador) {
          throw new Error("No se encontraron datos para el correo: " + emailColaborador);
        }

        var nombreColaborador = itemColaborador[SHEET_COLABORADOR_NOMBRES_APELLIDOS_IDX];
        var nombrePreferido = itemColaborador[SHEET_CAPACITY_NOMBRE_PREFERIDO_IDX];
        var nombresApellidosArray = nombreColaborador.split(", ");
        var nombreElegido = nombrePreferido == "" ? nombresApellidosArray[1] : nombrePreferido;
        var nombreConMayuscula = convertirNombreAPrimeroMayuscula(nombreElegido);
        var emailLider = itemColaborador[SHEET_COLABORADOR_EMAIL_LIDER_IDX];

        // Agrupar nombres e imágenes
        var variablesPlantilla = {
          nombreConMayuscula
        };

        var imagenes = {
          "banner": imagenBanner
        };

        var imagenesManager = {
          "bannerManager": ""
        };

        console.log("correoRecordatorioIngresoFechaRegreso:: " + emailColaborador + " - " + emailLider);
        enviarCorreoInicioMaternidad(emailColaborador, emailLider, variablesPlantilla, imagenes, imagenesManager, tipoSolicitud, nombreColaborador);

        guardarLog(itemColaborador[SHEET_COLABORADOR_REGISTRO_IDX], emailColaborador, TIPO_RECORDATORIOA_LLENAR_FECHA_REGRESO);
      } catch (error) {
        console.error("Error procesando el recordatorio de ingreso de fecha de regreso para el correo: " + emailColaborador + " - " + error.message);
      }
    }
  }
}

/**FIN - ALT - 150724 */

/*
function correoRecordatorioIngresoFechaRegreso() {
  var hojaPaternidad = SHEET_INGRESOS_MATERNIDAD;
  var datosHojaPaternidad = hojaPaternidad.getDataRange().getValues();
  var fechaActual = new Date();
  fechaActual.setHours(0, 0, 0, 0); // Aseguramos que solo comparamos la fecha, no la hora

  for (var numFila = 1; numFila < datosHojaPaternidad.length; numFila++) {
    var itemHojaPaternidad = datosHojaPaternidad[numFila];
    var fechaProbableParto = new Date(itemHojaPaternidad[FORM_DATOS_FECHA_PARTO_IDX]);

    // Restar 30 días a la fecha de probable parto
    var fechaParto = new Date(fechaProbableParto);
    fechaParto.setDate(fechaParto.getDate() - 30);
    fechaParto.setHours(0, 0, 0, 0);
    //console.log("fecha parto:: " + fechaParto);
    //console.log("fecha actual:: " + fechaActual);
    //console.log("------");

    if (fechaParto.getTime() === fechaActual.getTime()) {

        var tipoSolicitud = TIPO_RECORDATORIOA_LLENAR_FECHA_REGRESO;
        var emailColaborador = itemHojaPaternidad[SHEET_DATOS_EMAIL_IDX];

        var itemColaborador = obtenerDatosDeEmpleadoPorEmail(emailColaborador);

        var nombreColaborador = itemColaborador[SHEET_COLABORADOR_NOMBRES_APELLIDOS_IDX];
        var nombrePreferido = itemColaborador[SHEET_CAPACITY_NOMBRE_PREFERIDO_IDX];
        var nombresApellidosArray = nombreColaborador.split(", ");
        var nombreElegido = nombrePreferido == "" ? nombresApellidosArray[1] : nombrePreferido;
        var nombreConMayuscula = convertirNombreAPrimeroMayuscula(nombreElegido);
        var emailLider =itemColaborador[SHEET_COLABORADOR_EMAIL_LIDER_IDX];

        //conseguir imagenes
        var imagenBanner = obtenerImagenDrive(IMAGEN_RECORDATORIO_REGISTRAR_FECHA);

        //agrupar nombres e imagenes
        var variablesPlantilla = {
          nombreConMayuscula
        };

        var imagenes = {
          "banner": imagenBanner
        };

        var imagenesManager = {
          "bannerManager" : ""
        };
        console.log("correoRecordatorioIngresoFechaRegreso:: "+emailColaborador+" - "+emailLider);
        enviarCorreoInicioMaternidad(emailColaborador, emailLider, variablesPlantilla, imagenes,imagenesManager,tipoSolicitud,nombreColaborador);

        guardarLog(itemColaborador[SHEET_COLABORADOR_REGISTRO_IDX],emailColaborador,TIPO_RECORDATORIOA_LLENAR_FECHA_REGRESO);
    }
  }
}
*/
  /* ******************************* */
  /* **** FIN - ALT - 27062024 ***** */
  /* ******************************* */


function enviarCorreosDeRecordatorio(){}
function formSubmit(){}
function formSubmitSST(){}

// Base form maternidad
const SS_FORMULARIO_MATERNIDAD_ID = "";
const SS_FORMULARIO_MATERNIDAD = SpreadsheetApp.openById(SS_FORMULARIO_MATERNIDAD_ID);
const SHEET_INGRESOS_MATERNIDAD_NOMBRE = "Madre Gestante";
const SHEET_INGRESOS_MATERNIDAD = SS_FORMULARIO_MATERNIDAD.getSheetByName(SHEET_INGRESOS_MATERNIDAD_NOMBRE);

//Base form maternidad logs
const SHEET_LOGS_NOMBRE = "Logs";
const SHEET_LOGS = SS_FORMULARIO_MATERNIDAD.getSheetByName(SHEET_LOGS_NOMBRE);

//Base form maternidad reingreso
const SHEET_INGRESOS_REINCORPORACION_NOMBRE = "Reingreso";
const SHEET_INGRESOS_REINCORPORACION = SS_FORMULARIO_MATERNIDAD.getSheetByName(SHEET_INGRESOS_REINCORPORACION_NOMBRE);

//Base Capacity
const SS_BASE_CAPACITY_ID = '';  
const SS_BASE_CAPACITY = SpreadsheetApp.openById(SS_BASE_CAPACITY_ID);
const SHEET_BASE_CAPACITY_NOMBRE = 'BASE';
const SHEET_BASE_CAPACITY = SS_BASE_CAPACITY.getSheetByName(SHEET_BASE_CAPACITY_NOMBRE);

// Mensaje Correo beneficios a colaborador
const CORREO_ASUNTO_BENEFICIO_COLABORADOR = 'Felicitaciones por tu Embarazo! Conoce tus beneficios';
const CORREO_ASUNTO_MEDICO_OCUPACIONAL = 'Programa Madre Gestante de ';

/**INI - ALT - 18062024 */
function obtenerDatosDeEmpleadoPorEmail(empleadoEmail){
  console.log(empleadoEmail);
  // Elaborar query
  empleadoEmail = empleadoEmail.toUpperCase();
  var query = 'SELECT * WHERE I=\'' + empleadoEmail + '\' ';

  // Ejecutar query en BD TAM Red
  var resultado = executeQuery(SS_BASE_CAPACITY_ID, SHEET_BASE_CAPACITY_NOMBRE, query, "A1:CR", false);

  // Obtener resultado
  var itemEmpleado = null;
  if(resultado!=null && resultado.length>0){
    itemEmpleado = resultado[0];
  }

  return itemEmpleado;
}

function obtenerDatosDeManagerPorEmail(liderEmail){
  console.log(liderEmail);
  // Elaborar query
  liderEmail = liderEmail.toUpperCase();
  var query = 'SELECT * WHERE I=\'' + liderEmail + '\' ';

  // Ejecutar query en BD TAM Red
  var resultado = executeQuery(SS_BASE_CAPACITY_ID, SHEET_BASE_CAPACITY_NOMBRE, query, "A1:CR", false);

  // Obtener resultado
  var itemLider = null;
  if(resultado!=null && resultado.length>0){
    itemLider = resultado[0];
  }

  return itemLider;
}

function obtenerFechasRegreso() {
  // Query para seleccionar registros con "MATERNIDAD" en columna I y "VALIDADO" en columna O
  var query = 'SELECT * WHERE I = \'MATERNIDAD\' AND O = \'VALIDADO\' ORDER BY A, K DESC';

  // Ejecutar query 
  var resultado = executeQuery(SS_SUBSIDIOS_ID, SHEET_NOMBRE_HOJA_SUBSIDIOS, query, "A1:AN", false);

  // Crear un objeto para almacenar los registros más recientes por código de registro
  var registrosRecientes = {};

  // Recorrer los resultados para obtener el registro más reciente por cada código de registro en la columna A
  resultado.forEach(function(row) {
    var codigoRegistro = row[SHEET_SUBSIDIO_REGISTRO_IDX];
    var fecha = new Date(row[SHEET_SUBSIDIO_FECHA_FIN_IDX]);

    // Si el código de registro no está en el objeto o la fecha es más reciente, actualizar el registro
    if (!registrosRecientes[codigoRegistro] || new Date(registrosRecientes[codigoRegistro][SHEET_SUBSIDIO_FECHA_FIN_IDX]) < fecha) {
      registrosRecientes[codigoRegistro] = row;
    }
  });

  // Devolver un array con los registros más recientes
  return Object.values(registrosRecientes);
}

/**FIN - ALT - 18062024 */


/* *************************** */
/* **** QUERYS GENERALES ***** */
/* *************************** */

// Query generico para busquedas en archivos
function executeQuery(spreadSheetId, sheetName, queryFormula, range, showHeader) {
  var lastRow = SpreadsheetApp.openById(spreadSheetId).getSheetByName(sheetName).getLastRow();
  var qvizURL = 'https://docs.google.com/spreadsheets/d/' + spreadSheetId
    + '/gviz/tq?tqx=out:json&headers=1&sheet=' + sheetName
    + '&range=' + range + lastRow
    + '&tq=' + encodeURIComponent(queryFormula);
  //console.log("qvizURL="+qvizURL);
  var ret = UrlFetchApp.fetch(qvizURL, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() } }).getContentText();
  var resp = JSON.parse(ret.replace("/*O_o*/", "").replace("google.visualization.Query.setResponse(", "").slice(0, -2));
  var data = resp.table.rows.map(row => {
    return row.c.map(cols => {
      return cols === null ? '' : cols.f !== undefined ? cols.f : (cols.v === null ? '' : cols.v);
    });
  });
  //console.log("data: "+data);
  if (showHeader) {
    var header = resp.table.cols.map(col => {
      return col.label;
    });
    return [header].concat(data);
  } else {
    return data;
  }
}




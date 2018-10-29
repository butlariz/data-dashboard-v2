var dropRegion = document.getElementById('drop-region');
var dropTurma = document.getElementById('drop-class');
dropTurma.addEventListener('change', loadGraph);
var dropRegion1 = document.getElementById('compare-region1');
var dropTurma1 = document.getElementById('compare-class1');
var dropRegion2 = document.getElementById('compare-region2');
var dropTurma2 = document.getElementById('compare-class2');
dropTurma2.addEventListener('change', loadCompara);
var mainContent = document.querySelector('main');
var home = document.getElementById('home');
home.addEventListener('click', loadGraph);

resultData = {};
// timer();

function loadStudents(){
  mainContent.innerHTML='';
  for (i in data[dropRegion.value][dropTurma.value]['students']){
    var divStudents = document.createElement('div');
    var divName = document.createElement('div');
    var studentsImg = document.createElement('img');
    studentsImg.src = data[dropRegion.value][dropTurma.value]['students'][i]['photo'];
    nameStudents = data[dropRegion.value][dropTurma.value]['students'][i]['name'];
    divName.innerHTML = nameStudents; 
    divStudents.appendChild(studentsImg);
    divStudents.appendChild(divName);
    divStudents.className = "item-student"
    mainContent.appendChild(divStudents);
  }
}
  var changeStudents = document.getElementById('show-alunas');
  changeStudents.addEventListener('click', loadStudents);



function timer() {
  var d = new Date();
  document.getElementById('date').innerHTML = d.toLocaleTimeString();
  setTimeout('timer()', 1000);
}

window.onload = loadRegion();

function loadRegion(){ 
  var compararSede = document.getElementsByClassName("dropRegion");
  var nome = "";
  for (i in compararSede){
  nome = document.createElement('option');
  nome.innerHTML = 'selecione sede';
  nome.value = 'none';
  compararSede[i].appendChild(nome);
    for (eachSede in data){
        var itemMenu = document.createElement('option');
        itemMenu.value = eachSede;
        itemMenu.innerHTML = eachSede;
        compararSede[i].appendChild(itemMenu);
    }
  }
}

function loadClass(divSede,divTurma){
  var compararTurma = document.getElementById(divSede).value;
  var menuTurma = document.getElementById(divTurma);
  var nome = document.createElement('option');
  menuTurma.innerHTML='';
  nome.innerHTML = 'selecione turma';
  nome.value = 'none';
  menuTurma.appendChild(nome);
  for (eachTurma in data[compararTurma]){
      var itemMenu = document.createElement('option');
      itemMenu.value = eachTurma;
      itemMenu.innerHTML = eachTurma;
      menuTurma.appendChild(itemMenu);
  }
}

function loadGraph(){
  var newSede = [];
  var newTurma = [];
  newSede[0] = dropRegion.value;
  newTurma[0] = dropTurma.value;
  mainContent.innerHTML='';
  totalAndInactives(newSede,newTurma)
  scoreExceed(newSede,newTurma);
  nps(newSede,newTurma);
  scoreTech(newSede,newTurma);
  scoreHSE(newSede,newTurma);
  teacher(newSede,newTurma)
  jedi(newSede,newTurma)
  satisfaction(newSede,newTurma);
}   

function loadCompara(){
  var newSede = [];
  var newTurma = [];
  newSede[0] = dropRegion1.value;
  newTurma[0] = dropTurma1.value;
  newSede[1] = dropRegion2.value;
  newTurma[1] = dropTurma2.value;
  mainContent.innerHTML='';
  scoreExceed(newSede,newTurma);
  nps(newSede,newTurma);
  satisfaction(newSede,newTurma);
  scoreTech(newSede,newTurma);
  scoreHSE(newSede,newTurma);
}  

// Contar a porcentagem de alunas ativas e inativas
function totalAndInactives(sede,turma){
  var nameTotal = "Alunas presentes e desistentes"
  var inactives = 0;
  var actives = 0;
	var totalStudents = data[sede][turma]['students'].length;
	for (i in data[sede][turma]['students']){
		if (data[sede][turma]['students'][i]['active'] === false){
			inactives += 1;
		}
  }
  actives = totalStudents - inactives; 
  var total = [actives,inactives]
  var legendGraph = [];
  legendGraph[0] = "Ativas";
  legendGraph[1] = "Inativas";
  pieGraph(total, nameTotal, legendGraph);
}

// Comparação excedem
function scoreExceed(sede,turma){
  var nameExceed = "Alunas que excederam a pontuação Tech e HSE"
  var numberTotal = [];
  var percentTotal = [];

  for (v in sede) {
  totalStudents = data[sede[v]][turma[v]]['students'].length
    var numberHitGoal = [];
    var percentHitGoal = [];

    for (i in data[sede[v]][turma[v]]['students']){
      for (j in data[sede[v]][turma[v]]['students'][i]['sprints']){
        if (data[sede[v]][turma[v]]['students'][i]['sprints'][j]['score']['hse'] >= 840 && data[sede[v]][turma[v]]['students'][i]['sprints'][j]['score']['tech'] >= 1260){ 
          if (percentHitGoal[j] >= 0) {
            percentHitGoal[j] += (1 / totalStudents);
            numberHitGoal += 1;
          } else if (!percentHitGoal[j]){
            percentHitGoal[j] = (1 / totalStudents);
            numberHitGoal = 1;
            var scoreTotal = percentHitGoal
           }
        }
      }
    }
    var mediaSprints = numberHitGoal / percentHitGoal.length;
    numberTotal.push(mediaSprints);
    percentTotal.push(percentHitGoal);
  }

  resultData.Exceed = {};
  resultData.Exceed.name = nameExceed;
  resultData.Exceed.number = numberTotal;
  resultData.Exceed.percent = percentTotal;
  resultData.Exceed.subtitle = "Students";

  sprintGraph(resultData.Exceed);
  }

// Calcular NPS por Sprint 
function nps(sede,turma){
  var nameNPS = "NPS médio por sprint";
  var numberTotal = [];
  var percentTotal = [];

  for (v in sede) {
  var numberNPS = [];
  var percentNPS = [];
    for (i in data[sede[v]][turma[v]]['ratings']){
      var resultNPS = 0;
      resultNPS = data[sede[v]][turma[v]]['ratings'][i]['nps']['promoters'] - data[sede[v]][turma[v]]['ratings'][i]['nps']['detractors'];
      numberNPS.push(resultNPS);
      percentNPS.push(resultNPS/100);
    }
    var mediaSprint = numberNPS.reduce( function( acum, elem ) {
      return acum + elem;
    });
    var mediaNPS = (mediaSprint / 4) + "%";
    numberTotal.push(mediaNPS);
    percentTotal.push(percentNPS);
  }

  resultData.NPS = {};
  resultData.NPS.name = nameNPS;
  resultData.NPS.number = numberTotal;
  resultData.NPS.percent = percentTotal;
  resultData.NPS.subtitle = "NPS";

  sprintGraph(resultData.NPS);
}

// Contar a porcentagem de alunas que excederam a pontuação tecnica por sprint
function scoreTech(sede,turma){
  var nameTech = "Alunas que excederam a pontuação Tech";
  var numberTotal = [];
  var percentTotal = [];
    for (v in sede) {
      var totalStudents = data[sede[v]][turma[v]]['students'].length;
      var numberHitGoal = [];
      var percentHitGoal = [];
      for (i in data[sede[v]][turma[v]]['students']){
        for (j in data[sede[v]][turma[v]]['students'][i]['sprints']){
          if (data[sede[v]][turma[v]]['students'][i]['sprints'][j]['score']['tech'] >= 1260){ 
            if (numberHitGoal[j] >= 0) {
              numberHitGoal[j] += 1;
              percentHitGoal[j] += (1 / totalStudents);
            } else if (!numberHitGoal[j]){
              numberHitGoal[j] = 1;
              percentHitGoal[j] = (1 / totalStudents);
            }
          }
        }
      }
    numberTotal.push(numberHitGoal);
    percentTotal.push(percentHitGoal);
    }
  
    resultData.notaTech = {};
    resultData.notaTech.name = nameTech;
    resultData.notaTech.number = numberTotal;
    resultData.notaTech.percent = percentTotal;
  
    scoreGraph(resultData.notaTech);
  }

// Contar a porcentagem de alunas que excederam a pontuação HSE por sprint
function scoreHSE(sede,turma){
  var nameHSE = "Alunas que excederam a pontuação HSE";
  var numberTotal = [];
  var percentTotal = [];
    for (v in sede) {
      var totalStudents = data[sede[v]][turma[v]]['students'].length;
      var numberHitGoal = [];
      var percentHitGoal = [];
      for (i in data[sede[v]][turma[v]]['students']){
        for (j in data[sede[v]][turma[v]]['students'][i]['sprints']){
          if (data[sede[v]][turma[v]]['students'][i]['sprints'][j]['score']['hse'] >= 840){ 
            if (numberHitGoal[j] >= 0) {
              numberHitGoal[j] += 1;
              percentHitGoal[j] += (1 / totalStudents);
            } else if (!numberHitGoal[j]){
              numberHitGoal[j] = 1;
              percentHitGoal[j] = (1 / totalStudents);
            }
          }
        }
      }
    numberTotal.push(numberHitGoal);
    percentTotal.push(percentHitGoal);
    }
  
    resultData.notaHSE = {};
    resultData.notaHSE.name = nameHSE;
    resultData.notaHSE.number = numberTotal;
    resultData.notaHSE.percent = percentTotal;
    scoreGraph(resultData.notaHSE);
  }

//Calcular nota teacher
function teacher(sede,turma){
  var nameTeacher = "Nota média Mentores"
  var scoreTeacher = 0;
  var resultTeacher =  0;
  for (i in data[sede][turma]['ratings']){
    resultTeacher += data[sede][turma]['ratings'][i]['teacher'];
    scoreTeacher = resultTeacher / data[sede][turma]['ratings'].length;
  }
  totalTeacher = [scoreTeacher, 5 - scoreTeacher];
  var legendGraph = [];
  legendGraph[0] = "Média";
  legendGraph[1] = "Restante";
  pieGraph(totalTeacher, nameTeacher, legendGraph);
}

//Calcular nota Jedi
function jedi(sede,turma){
  var nameJedi = "Nota média Jedi"
  var scoreJedi = 0;
  var resultJedi = 0;

  for (i in data[sede][turma]['ratings']){
    resultJedi += data[sede][turma]['ratings'][i]['jedi'];
    scoreJedi = resultJedi / data[sede][turma]['ratings'].length;
  }
  totalJedi = [scoreJedi, 5 - scoreJedi];
  var legendGraph = [];
  legendGraph[0] = "Media";
  legendGraph[1] = "Restante";
  pieGraph(totalJedi, nameJedi, legendGraph);
}

//Calcular satisfação de Alunas
function satisfaction(sede,turma){
  var nameSatisfaction = "Alunas satisfeitas";
  var numberTotal = [];
  var percentTotal = [];
    
  for(v in sede){
    var percentStudent = [];
    var numberStudent = [];
    for (i in data[sede[v]][turma[v]]['ratings']){
      var resultSatisfaction = 0;
      resultSatisfaction =  data[sede[v]][turma[v]]['ratings'][i]['student']['cumple'] +  data[sede[v]][turma[v]]['ratings'][i]['student']['supera'];
      numberStudent.push(resultSatisfaction)
      percentStudent.push(resultSatisfaction/100);
    }

    var mediaSprint = numberStudent.reduce( function( acum, elem ) {
      return acum + elem;
    });
    var mediaSatisfaction = (mediaSprint / percentStudent.length) + "%";

    numberTotal.push(mediaSatisfaction);
    percentTotal.push(percentStudent);
  }
  resultData.Satisfaction = {};
  resultData.Satisfaction.name = nameSatisfaction;
  resultData.Satisfaction.number = numberTotal;
  resultData.Satisfaction.percent = percentTotal;
  resultData.Satisfaction.subtitle = "Students";

  sprintGraph(resultData.Satisfaction);
}

// Gráficos 
function pieGraph(value, nameGraph, status) {
  var divItem = document.createElement('div');
  createHtml(nameGraph,divItem);
  var newGraph = document.createElement('div');
  divItem.appendChild(newGraph);

  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(function(){
    drawChart(value, status);
  });
  function drawChart(valueGraph, statusGraph) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Status');
    data.addColumn('number', 'Porcentagem');
    data.addRows([
      [statusGraph[0], valueGraph[0]],
      [statusGraph[1], valueGraph[1]]
    ]);
    var options = { 'width':330,
                    'height':350,
                    colors:['#f7b617','#feffa6'],
                    pieSliceTextStyle: {
                      color: 'black',
                    },
                    chartArea:{width: '90%'},
                    pieHole: 0.6,};

    var chart = new google.visualization.PieChart(newGraph);
    chart.draw(data, options);
  }
}

function scoreGraph(keyData) {
  var divItem = document.createElement('div');
  createHtml(keyData.name,divItem);
  var newGraph = document.createElement('div');

  for (i in keyData.number) {
    var infoGraph = document.createElement('div');
    for(j in keyData.number[i]){
      var counter = parseInt(j);
      var itemInfo = document.createElement('span');
      itemInfo.className = "info-sprint"
      itemInfo.innerHTML  = "<h3>" + keyData.number[i][j] + "</h3>"
      itemInfo.innerHTML += "<span> Students </span>"
      itemInfo.innerHTML += "<span> Sprint " + (counter + 1) + "</span>"
      infoGraph.appendChild(itemInfo);
      infoGraph.className = "info-graphic";
      divItem.classList.add("item","score-graphic");
      divItem.appendChild(infoGraph);
    }
  }

  divItem.appendChild(newGraph);
  google.charts.load('current', {'packages':['line']});
  google.charts.setOnLoadCallback(function(){
    drawChart(keyData);
  });
  function drawChart(keyValue) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Sprints');
    data.addColumn('number', 'Students 1');
    if (keyValue.percent.length > 1) {
     data.addColumn('number', 'Students 2');
    }
    var graphRows = [];
    for (i = 0; i < keyValue.percent[0].length; i++) {
      counter = parseInt(i);
      if (keyValue.percent.length === 1) {
        graphRows[i] = ["" + (counter + 1) + "",  keyValue.percent[0][i]];
      } else if (keyValue.percent.length > 1) {
       graphRows[i] = ["" + (counter + 1) + "",  keyValue.percent[0][i], keyValue.percent[1][i]];
      }
    }
    data.addRows(graphRows);

    var options = {
      width: 445,
      height: 500,
      colors: ['#FF009E', '#8ee2b4'],
      vAxis: {
        viewWindow: { min: 0, max: 1 },	
        format: "percent"
      },
      legend: { position: 'none' }
    }
    var chart = new google.charts.Line(newGraph);
    chart.draw(data, google.charts.Line.convertOptions(options));
  }
}

//name number percent
function sprintGraph(keyData){
  var divItem = document.createElement('div');
  createHtml(keyData.name,divItem);
  var newGraph = document.createElement('div');
  for(i in keyData.number){
    var infoGraph = document.createElement('div');
    var itemInfo = document.createElement('span');
    itemInfo.innerHTML  = "<h3>" +  keyData.number[i] + "</h3>"
    if (keyData.subtitle === "NPS") {
      itemInfo.innerHTML += "<span> Média </span>"
    } else {
     itemInfo.innerHTML += "<span>" + keyData.subtitle + "</span>"
    }
    infoGraph.appendChild(itemInfo);
    infoGraph.className = "info-graphic";
    divItem.appendChild(infoGraph);
  }
  divItem.appendChild(newGraph);

  google.charts.load('current', {'packages':['line']});
  google.charts.setOnLoadCallback(function(){
    drawChart(keyData);
  });
  function drawChart(keyValue) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Sprints');
    data.addColumn('number', keyValue.subtitle);
    if (keyValue.percent.length > 1) {
      data.addColumn('number', keyValue.subtitle);
    }
    var graphRows = [];
    for (i = 0; i < keyValue.percent[0].length; i++) {
      counter = parseInt(i);
      if (keyValue.percent.length === 1) {
        graphRows[i] = ["" + (counter + 1) + "",  keyValue.percent[0][i]];
      } else if (keyValue.percent.length > 1) {
       graphRows[i] = ["" + (counter + 1) + "",  keyValue.percent[0][i], keyValue.percent[1][i]];
      }
    }
    data.addRows(graphRows);

    var options = {
      curveType: 'function',
      width: 280,
      height: 290,
      colors: ['#FF009E','#8ee2b4'],
      legend: { position: 'none' },
      vAxis: {
        viewWindow: { min: 0, max: 1 },	
        format: "percent"
      }
    };

    var chart = new google.charts.Line(newGraph);
    chart.draw(data, google.charts.Line.convertOptions(options));
  }
}

function createHtml(nameGraph, divItemLocal){
  var graphTitle = document.createElement('h2');
  graphTitle.textContent = nameGraph;
  divItemLocal.className = "item";
  divItemLocal.appendChild(graphTitle);
  mainContent.appendChild(divItemLocal);
}

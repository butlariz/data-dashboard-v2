//// MEGA TESTE COMPARAÇÃO
var mainContent = document.querySelector('main');
var sede = ['AQP'];
var turma = ['2017-1'];

resultData = {
  // notaTech: [[0.1,0.5,0.3],[1,2,3], "Gráfico de teste Tech"],
  // notaHSE: [[0.1,0.5,0.3],[1,2,3], "Gráfico de teste HSE"], 
  // notaTech: [percentHitGoal, sprintsHitGoal, nameTech],
  // notaHSE: [percentHitGoal,sprintsHitGoal, nameHSE]
}

scoreTech();

// Contar a porcentagem de alunas que excederam a pontuação tecnica por sprint
function scoreTech(){
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

  testGraph(resultData.notaTech);
}

console.log(resultData);

// Contar a porcentagem de alunas que excederam a pontuação HSE por sprint
function scoreHSE(){
  var nameHSE = "Alunas que excederam a pontuação HSE";
  totalStudents = data[dropSede.value][dropTurma.value]['students'].length;
    var sprintsHitGoal = [];
    var percentHitGoal = [];
    for (i in data[dropSede.value][dropTurma.value]['students']){
      for (j in data[dropSede.value][dropTurma.value]['students'][i]['sprints']){
        if (data[dropSede.value][dropTurma.value]['students'][i]['sprints'][j]['score']['hse'] >= 840){ 
          if (sprintsHitGoal[j] >= 0) {
            sprintsHitGoal[j] += 1;
            percentHitGoal[j] += (1 / totalStudents);
          } else if (!sprintsHitGoal[j]){
            sprintsHitGoal[j] = 1;
            percentHitGoal[j] = (1 / totalStudents);
            var scoreTotal = [percentHitGoal, sprintsHitGoal]
            }
        }
      }
    }
    // scoreGraph(scoreTotal, nameHSE);
  }


// testGraph([[0.1,0.5,0.3],[1,2,3]], "Gráfico de teste");


function testGraph(keyData) {
  console.log(keyData);
  console.log(keyData.percent[0]);
  var divItem = document.createElement('div');
  createHtml(keyData.name,divItem);
  var infoGraph = document.createElement('div');
  var newGraph = document.createElement('div');
  infoGraph.className = "info-graphic";
  divItem.appendChild(infoGraph);
  divItem.appendChild(newGraph);

  for(i in keyData.number[0]){
    var counter = parseInt(i);
    var itemInfo = document.createElement('span');
    itemInfo.className = "info-sprint"
    itemInfo.innerHTML  = "<h3>" + keyData.number[0][i] + "</h3>"
    itemInfo.innerHTML += "<span> Students </span>"
    itemInfo.innerHTML += "<span> Sprint " + (counter + 1) + "</span>"
    infoGraph.appendChild(itemInfo);
  }

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

function createHtml(nameGraph, divItemLocal){
  var graphTitle = document.createElement('h2');
  graphTitle.textContent = nameGraph;
  divItemLocal.className = "item";
  divItemLocal.appendChild(graphTitle);
  mainContent.appendChild(divItemLocal);
}

/* Developed by Nura Programmer */

var studentList = [];
var serial = 0;
var records;
var tableData = "";
var studentSerial;

$(function () {
  //localStorage.clearAll();
//getRecords();

  $("#modal").hide();

  if(tableData == ""){
    if($("title").text() == "Students' Record Sheet | Nura Programmer"){
      tableData = $("table").html();
      alert("You can Add some Record in the 'New Record' Tab ^!");
    }
  }

  $("#close, #modal-head span").on("click", function () {
    $("#modal").hide();
  });

  //============================
  $("#del").on("click", function () {
    $("#modal").hide(); // Hide the view
    delRecord(studentSerial);
    refreshPage();
  });

  //===================================
  //document.getElementById('modal').style.display = "none";

if(localStorage){
   records = localStorage.getItem("npStudents");
   if(records){
      studentList = JSON.parse(records);
      refreshPage();
   }else{
      getRecords();
   }
}else{
    alert("[-] Your Browser Does Not Support Storing "
    +"Files locally!");
  }
});

function viewRecord(sn) {
  $("#modal").show();
  var s = studentList[sn];
  var dRemark = decorateRemark(s.remark);

  var ul = $("<ul></ul>").html(
    "<li>Name: "+ s.fName +" "+ s.sName +"</li>"+
    "<li>1<sup>st</sup> Test: "+ s.test[0] +"</li>"+
    "<li>2<sup>nd</sup> Test: "+ s.test[1] +"</li>"+
    "<li>Exam: "+ s.test[2] +"</li>"+
    "<li>Total: "+ s.total +"</li>"+ dRemark
  );

  studentSerial = sn;
  $("#modal-body").html(ul);
}

function decorateRemark(rk) {
  var str1, str2, str3;
  str1 = "<li class='";
  str2 = "remark ";
  str3 = "'>Remark: "+ rk +"</li>";

  switch (rk) {
    case "A'": str2 += "excellent-remark";
      break;
    case "A": case "B": case "C": str2 += "good-remark";
      break;
    case "D": str2 += "fair-remark";
      break;
    case "E": str2 += "poor-remark";
      break;
    case "F": default: str2 += "fail-remark";
  }

  rk = str1 + str2 + str3;
  return rk;
}

function searchRecord() {
  var se = $("#search");

  if(found()){
    viewRecord(studentSerial);
  }else {
    alert("\""+se.val() +"\" -> Entary Found!");
  }

  se.val(""); //Clear Field
  return false;  //Disable Submiting the form
}

function getText(txt) {
  var txtArr = txt.split(" ");
  txt = "";

  for(var i = 0; i < txtArr.length; ++i){
    txt += txtArr[i].toLowerCase().trim();
  }
  return txt;
}

function found() {
  var sTxt = getText($("#search").val());
  var sRecord;

  for(var i = 0; i < studentList.length; ++i){
    sRecord = studentList[i];
    sRecord.fName = getText(sRecord.fName);
    sRecord.sName = getText(sRecord.sName);

    switch(sTxt){
      case sRecord.fName:
      case sRecord.fName + sRecord.sName:
        studentSerial = i;
        return true;
    }
  }
  return false;
}

function delRecord(sn) {
  var newList = [];
  //alert("Deleting :"+sn);
  for(var i = 0; i < studentList.length-1; ++i){
    if(i < sn){
      newList[i] = studentList[i];
    }else {
      newList[i] = studentList[i+1];
    }
  }

  serial = 0;
  $("table").html(tableData);

  studentList = newList;
  localStorage.setItem("npStudents",
    JSON.stringify(studentList));
}

function saveData() {
  var fn = $("#formPanel #firstName").val();
  var sn = $("#formPanel #surName").val();
  var t1 = Number($("#formPanel #test1").val());
  var t2 = Number($("#formPanel #test2").val());
  var em = Number($("#formPanel #exam").val());

  studentList.push(new student(fn, sn, [t1, t2, em]));
  localStorage.setItem("npStudents",
    JSON.stringify(studentList));

  var addNew = confirm("Record Saved Successfully"
  +"\nDo You Want Add New Record?");

  if(addNew){
    document.getElementById('form1').reset();  //empty form feild
  }else {
    window.location = "index.html";
  }

  return false;  //Disable Submiting the form
}

function getRecords() {
  $.getJSON("js/studentRecords.json", function (json) {
    for (var i = 0; i < json.length; i++) {
      var j = json[i];
      studentList.push(new student(j.fName, j.sName,j.test));
    }

    localStorage.setItem("npStudents",
      JSON.stringify(studentList));
    refreshPage();
  });
}
/* Nura Programmer */
function refreshPage() {
  if($("title").text() != "Students' Record Sheet | Nura Programmer")
    return;

  let newPage = "";
  for(var i = 0; i < studentList.length; ++i)
    newPage += updatePage(studentList[i]);
  
  $("tbody").html(newPage);
}

function updatePage(student) {

  return $("<tr id='"+ serial
  +"' onclick='viewRecord("+ serial +")'></tr>").html(
    "<td>"+ ++serial +"</td>"+
    "<td>"+ student.fName +"</td>"+
    "<td>"+ student.sName +"</td>"+
    "<td>"+ student.test[0] +"</td>"+
    "<td>"+ student.test[1] +"</td>"+
    "<td>"+ student.test[2] +"</td>"+
    "<td>"+ student.total +"</td>"+
    "<td>"+ student.remark +"</td>"
  );
  
  //alert($("table").html());
}

function student(fName, sName, test) {
  this.fName = fName;
  this.sName = sName;
  this.test = test;
  this.total = getTotal(test);
  this.remark = getRemark(this.total);
}

function getTotal(marks) {
  var test;
  var total = 0;

  for(test = 0; test < marks.length; ++test){
    total += marks[test];
  }
  return total;
}

function getRemark(totalMark) {
  var remark = "";
  totalMark /= 10;

  if(totalMark >= 9){
    remark = "A'";
  }else if (totalMark >= 7 && totalMark < 9) {
    remark = "A";
  }else if (totalMark >= 6 && totalMark < 7) {
    remark = "B";
  }else if (totalMark >= 5 && totalMark < 6) {
    remark = "C";
  }else if (totalMark >= 4.5 && totalMark < 5) {
    remark = "D";
  }else if (totalMark >= 4 && totalMark < 4.5) {
    remark = "E";
  }else {
    remark = "F";
  }

  return remark;
}

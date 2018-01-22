/*
var lengthInMonths = 
var interestRate = 
*/

$(document).ready(function(){
    
    var noExtraInputs = function(){

        var propValue = Number($('#propvalue').val());
        var lengthInMonths = Number($('#year').val()) * 12 + Number($('#month').val()) ;
        var interestRate = Number($('#interest').val());
        
        var validated = validate(propValue,lengthInMonths,interestRate);
        if (validated){
           noExtraPayment(propValue,lengthInMonths,interestRate); //calculate values
           $('#result').prop('hidden', false);    // show values
        }
   
        
       // $('#propvalue').attr("placeholder", "Type your answer here");
       // styleContent = 'input:-moz-placeholder {color: red;} input::-webkit-input-placeholder {color: red}'
       // $('#propvalue').text(styleContent);
    }

    var validate = function(propValue,lengthInMonths,interestRate){   // validate if one or more of required values are missing

        console.log(propValue + ' ' + lengthInMonths + ' ' + interestRate);

        if(propValue == 0 || lengthInMonths == 0 || interestRate == 0  ){
            alert("Some of the values are missing");
            return false;
        }
        else{
            return true;
        }
    }
    
    var monthlyPayment = function(propValue,lengthInMonths,interestRate){   //calculate monthly payment

     var n = lengthInMonths ;   // number of monthly payments, called the loan's term
     var r = (interestRate / 12 ) / 100; // the monthly interest rate, expressed as a decimal, not a percentage  
     var p = propValue; //  the amount borrowed, known as the loan's principal
      
     // formula for monthly payment (c) = rP(1+r)^n / (1+r)^n - 1
     var a =  (Math.pow((1+r), n));  //   a = (1+r)^n
     var c = (r*p*a) / (a - 1) // putting value of a in c = rP(1+r)^n / (1+r)^n - 1
     c = Number(c.toFixed(2));
     console.log('called monthly payment');

     return c;
     
    }

    var noExtraPayment = function(propValue,lengthInMonths,interestRate) { // calculate and populate no extra payment section
     
    var p = propValue;
    var n = lengthInMonths;
    var r = interestRate;

    var c = monthlyPayment(p,n,r);
     // populate noExtraPayment Section
    $('#nmonthly').val(c);    //monthly payment
    var nTotalInter = Number((n*c - p).toFixed(2));
    $('#ninterest').val(nTotalInter);  //total interest
    var nInterestPrinc = Number((nTotalInter + p).toFixed(2)) ;
    $('#nprinint').val(nInterestPrinc);  // principal + interest
    }
    
    





    $('#summary').click(function(){
    
        noExtraInputs();
        return false;
    });
    
    $('#table').click(function(){
        
        $('form').hide();
        tableInputs();
        $('#amorTable').prop('hidden', false);  
        return false;
    });


    /*var calAmortization = function(){
        
        var propValue = Number($('#propvalue').val());
        var lengthInMonths = Number($('#year').val()) * 12 + Number($('#month').val()) ;
        var interestRate = Number($('#interest').val());
        console.log("calAmortization called");
        var principal = propValue;     // original principal
        
        
        var monthlyRate = (interestRate/12)/100;
        var monthlyPayment = monthlyPayment();
        
    };*/

     
    var tableInputs = function(){

        var propValue = Number($('#propvalue').val());
        var lengthInMonths = Number($('#year').val()) * 12 + Number($('#month').val()) ;
        var interestRate = Number($('#interest').val());
        
        var validated = validate(propValue,lengthInMonths,interestRate);
        if (validated){
           noExtraPayment(propValue,lengthInMonths,interestRate); //calculate values
          // $('#result').prop('hidden', false);    // show values
        }
    }



});

var table = [];

var amortization = function(p,c,r,table){  // takes input principal , monthly payment , yearly rate and and empty array
	var c = c;
    var r = r;
    var interestPaid = p*r*(1/12)*(1/100)  // interest paid monthly
    var principalPaid = c - interestPaid  // principal paid monthly
    var principalRem = p - principalPaid //
    var table = table;
    var row = {payment:c,interest:interestPaid,principal:principalPaid,remaining:principalRem}
      table.push(row);
     if (principalRem <= 0){
     console.log(table)
     } else{
     amortization(principalRem,c,r,table)
     }
  
}
amortization(170000,1223.99,3,table);
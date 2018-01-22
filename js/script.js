$(document).ready(function(){  // all other functions lie inside it 
 


    var validate = function(propValue,lengthInMonths,interestRate){   // validate if one or more of required values are missing or in wrong format
        
        if(propValue == 0 || lengthInMonths == 0 || interestRate == 0  ){
            alert("Some of the values are missing");
            return false;
        }
        else{
            return true;
        }
    };

    var userInputs = function(){
        
        var propValue = isNaN(Number($('#propvalue').val())) ? 0 : Number($('#propvalue').val());  // 0 if not a number else input 
        var lengthInMonths = isNaN(Number($('#year').val())) ? 0 : Number($('#year').val()) * 12 + Number($('#month').val()) ;
        var interestRate = isNaN(Number($('#interest').val())) ? 0 : Number($('#interest').val()); //yearly
        
        var addPerMonth = isNaN(Number($('#addmonth').val())) ? 0 :  Number($('#addmonth').val());
        var addPerYear = isNaN(Number($('#addyear').val())) ? 0 : Number($('#addyear').val());
        var prepay = isNaN(Number($('#prepay').val())) ? 0 : Number($('#prepay').val());
        var yearlyPayMonth = $('#yearlyPaymentMonth').val();
    
        return {propValue:propValue, lengthInMonths:lengthInMonths , interestRate:interestRate, addPerMonth:addPerMonth , addPerYear:addPerYear,prepay:prepay,yearlyPayMonth:yearlyPayMonth};
    }
    
    var calMonthlyPayment = function(n,r,p){  //takes input length(in months , annual rate , principal )
     
        var n = n;   // number of monthly payments, called the loan's term
        var r = (r / 12 ) / 100; // the monthly interest rate, expressed as a decimal, not a percentage  
        var p = p ;  //- userInput.prepay; //  the amount borrowed, known as the loan's principal
      
        // formula for monthly payment (c) = rP(1+r)^n / (1+r)^n - 1
        var a =  (Math.pow((1+r), n));  //   a = (1+r)^n
        var c = (r*p*a) / (a - 1) // putting value of a in c = rP(1+r)^n / (1+r)^n - 1
        return c;
    };

    var calAmortzTable = function(userInput){
        var userInput = userInput;
        var addPerMonth = userInput.addPerMonth;
        var addPerYear = userInput.addPerYear;
        var prepay = userInput.prepay;
        var yearlyPayMonth = userInput.yearlyPayMonth;
        
        console.log(addPerMonth + ' ' + addPerYear + ' ' +prepay);;
        if(addPerMonth + addPerYear + prepay == 0){
            var withExtraPayment = false; 
        }else{
            var withExtraPayment = true;
            
        }  
        // with extra payment
 
        if(withExtraPayment){
           
        
            var c = calMonthlyPayment(userInput.lengthInMonths,userInput.interestRate,userInput.propValue-userInput.prepay) + addPerMonth; 
            var r = userInput.interestRate;
            var p = userInput.propValue - prepay;
    
            var month = 0;
            var table = [];
        
            
            while(!isFinalMOnth) {  // run till final month's payment row is  pushed in table
            month = month + 1;
            if(yearlyPayMonth == month || month %12 ==yearlyPayMonth){  // add yearly payment to the specified month's monthly payment c
                c = c + addPerYear;   
            }
            
            var interestPaid = p*r*(1/12)*(1/100);
            var principalPaid = c - interestPaid;
            if(p < c){   // prinicipal remaining of prev month is less than this months monthly payment , just pay rem amount not , c
                principalPaid = p;
                isFinalMOnth = true;
                c = principalPaid + interestPaid;
            }
            var principalRem = p - principalPaid;
            
            p = principalRem;

            var row = {month:month, payment:c,interest:interestPaid,principal:principalPaid,remaining:principalRem};
            table.push(row);   
           
            if(yearlyPayMonth == month || month %12 ==yearlyPayMonth){  // reset value of c to regular after adding yearly payment to specific month
            
            c = c - addPerYear;  // subtract the added extra yearly payment 
           
            }
           
       }

 
         } else{      // without extra payment
         
         alert("here");
         var c =  calMonthlyPayment(userInput.lengthInMonths,userInput.interestRate,userInput.propValue);
         var r = userInput.interestRate;
         var p = userInput.propValue;
         var month = 0;
         var table = [];
         var isFinalMOnth = false;    

         while(!isFinalMOnth) {  // run till final month's payment row is  pushed in table
         
             var interestPaid = p*r*(1/12)*(1/100);
             var principalPaid = c - interestPaid;
             var principalRem = p - principalPaid;
             p = principalRem;
             month = month + 1;
             var row = {month:month, payment:c,interest:interestPaid,principal:principalPaid,remaining:principalRem};
             table.push(row);   
             if(p + (p*r*(1/12)*(1/100)) <= c )   {  // // if next month's principle + interest < monthy payment , next month is final month 
                 isFinalMOnth = true; // next month is final month
             }
        }
        // for populating final month's row 
        interestPaid =  p*r*(1/12)*(1/100);
        principalPaid = p;   // all of the remaining is paid at final month
        principalRem = 0;
        month = month + 1;
        var row = {month:month, payment:p+interestPaid,interest:interestPaid,principal:principalPaid,remaining:principalRem};
        table.push(row);   


       
    }
    return (table);
}
    
     var showTable = function(){
         $('form').hide();
         $('#amorTable').prop('hidden', false);  
     }

     var populateTable = function(table){
     
        var tableRef = document.getElementById('amorTable').getElementsByTagName('tbody')[0];

        for (var i = 0; i<table.length; i++){

            var row   = tableRef.insertRow(tableRef.rows.length);

            var cell1  = row.insertCell(0);
            var text1  = document.createTextNode(table[i].month);
            cell1.appendChild(text1);

            var cell2  = row.insertCell(1);
            var text2  = document.createTextNode(table[i].payment.toFixed(2));
            cell2.appendChild(text2);
    
            var cell3  = row.insertCell(2);
            var text3  = document.createTextNode(table[i].interest.toFixed(2));
            cell3.appendChild(text3);

            var cell4  = row.insertCell(3);
            var text4  = document.createTextNode(table[i].principal.toFixed(2));
            cell4.appendChild(text4);

            var cell5  = row.insertCell(4);
            var text5  = document.createTextNode(table[i].remaining.toFixed(2));
            cell5.appendChild(text5);
        }
     
     }
 
     $('#table').click(function(){

        
         
         var userInput = userInputs();
         var ifValidated = validate(userInput.propValue, userInput.lengthInMonths , userInput.interestRate);
         if (ifValidated){    // cal and show table
            $('#back').prop("hidden",false);
            var table =  calAmortzTable(userInput);
            populateTable(table);
            showTable();
         }
         return false;  // to prevent auto reload;
     });
 
    $('#back').click(function(){
        location.reload(); 
    });

    
    $('#summary').click(function(){
    
        var userInput = userInputs();
        var ifValidated = validate(userInput.propValue, userInput.lengthInMonths , userInput.interestRate);
        



        if (ifValidated){
           
            var c = calMonthlyPayment(userInput.lengthInMonths,userInput.interestRate,userInput.propValue);
            var intPrin = c * userInput.lengthInMonths;
            var i = intPrin - userInput.propValue;
            
            $('#result').prop("hidden",false);
            //populate section without extra payment
            $('#nmonthly').val(c.toFixed(2));
            $('#nint').val(i.toFixed(2));
            $('#intprin').val(intPrin.toFixed(2));
            
            if((userInput.addPerMonth + userInput.addPerYear + userInput.prepay) != 0){  // if consists of extra payment , more logic required
                $('#withextra').prop('hidden',false);
                var table =  calAmortzTable(userInput);                
                var month = table.length;
                var interest = 0;
                var principal = 0;

                for (j = 0; j < table.length; j++){

                    interest = interest + table[j].interest;
                    principal = principal + table[j].principal;
                }
                // NOw compare with non - extra payment and populate the second section
                var interestSaved = i - interest;
                var payEarlyBy = userInput.lengthInMonths - month ; 
                
                $('#ninterest').val(interest.toFixed(2));
                $('#nprinint').val((interest + userInput.propValue - userInput.prepay).toFixed(2));
                $('#nsave').val(interestSaved.toFixed(2));
                $('#npayoff').val((userInput.lengthInMonths - month) + ' month');
                      
            }
        }     
     
        return false;
    });


});
$(function (){
	
	
	var $input1 = $('#input1');
	var $collapse1 = $('#collapse1');
	var $collapse2 = $('#collapse2');
	var $collapse3 = $('#collapse3');
	var $panelToken = $('#panelToken');
	var $panelRequestToken = $('#panelRequestToken');
	var $getUserAuth = $("#getUserAuth");
	var $getAddress = $("#getAddress");
	var $getPartner = $("#getPartner");
	var $getAgeCertificate = $("#getAgeCertificate");
	var $getcashAccounts = $("#getcashAccounts");
	var $getTransactions = $("#getTransactions");
	var $selectIban = $("#selectIban");
	
	
	$collapse1.collapse('show');
	
	var $hash = window.location.hash.replace("#","?");
	if ($hash != "") {
		var params={};
		$hash.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
			params[key] = value;
		});
		if ($input1.val(params["access_token"])) {
			$panelToken.attr("class","panel panel-success");
			$panelRequestToken.attr("class","panel panel-success center");
			$getUserAuth.attr("class","btn btn-success");
			$collapse2.collapse('show');
		}
		else {
			$panelToken.attr("class","panel panel-danger");
			$panelRequestToken.attr("class","panel-danger");
			$getUserAuth.attr("class","btn btn-danger");
			$input1.val("Bei der Genehmigung ist ein Fehler aufgetreten!");
		}
	}
	
	$getUserAuth.click(function(){
		
		window.location = "https://simulator-api.db.com/gw/oidc/authorize?response_type=token&redirect_uri=http://dbAPI.kochanski.net&client_id=58e64c17-5c97-4706-938c-98e64b3fd046"
	});
		
	$getAddress.click(function(){
		
		var $panelAddress = $("#panelAddress");
		var $tableAddress = $("#tableAddress > tbody");
		
		$.ajax({
			url: 'https://simulator-api.db.com:443/gw/dbapi/v1/addresses',
			headers: {'Authorization': 'Bearer ' + $input1.val()
			},
		})
		.fail(function (xhr, status, error) {
			$panelAddress.attr("class","panel panel-danger");
			$getAddress.attr("class","btn btn-danger");
			$collapse1.collapse('show');
			$tableAddress.empty();
			$tableAddress.attr("class","text-danger");
			$tableAddress.append('<tr><td>'+ status + '</td><td>' + error + '</td></tr>');
			$tableAddress.append('<tr><td colspan=2>'+ xhr.responseText + '</td></tr>');
		})
		.done(function(data, textStatus, jqXHR) {
			$panelAddress.attr("class","panel panel-success");
			$getAddress.attr("class","btn btn-success");
			$collapse1.collapse('hide');
			$tableAddress.empty();
			$.each(data, function(i, item) {
				$tableAddress.append("<tr><td>	Straße, Hausnummer<br>PLZ, Ort<br>Land<br>Meldeadresse?<br>Adresstyp</td><td>"
												+ item.street 				+ " " + item.houseNumber	+ "<br>"
												+ item.zip					+ " " + item.city			+ "<br>"
												+ item.country											+ "<br>"
												+ item.registeredResidence								+ "<br>"
												+ item.addressType
									+ "</td></td>");
			});
		});
	});
	
	$getcashAccounts.click(function(){
		
		var $panelCashAccounts = $("#panelCashAccounts");
		var $tableCashAccounts = $("#tableCashAccounts > tbody");
		
		$selectIban.val('default');
		
		$.ajax({
			url: 'https://simulator-api.db.com:443/gw/dbapi/v1/cashAccounts',
			headers: {'Authorization': 'Bearer ' + $input1.val()
			},
		})
		.fail(function (xhr, status, error) {
			$panelCashAccounts.attr("class","panel panel-danger");
			$getcashAccounts.attr("class","btn btn-danger");
			$collapse1.collapse('show');
			$tableCashAccounts.empty();
			$tableCashAccounts.attr("class","text-danger");
			$tableCashAccounts.append('<tr><td>'+ status + '</td><td>' + error + '</td></tr>');
			$tableCashAccounts.append('<tr><td colspan=2>'+ xhr.responseText + '</td></tr>');
		})
		
		.done(function(data, textStatus, jqXHR) {
			$panelCashAccounts.attr("class","panel panel-success");
			$getcashAccounts.attr("class","btn btn-success");
			$collapse1.collapse('hide');
			$tableCashAccounts.empty();
			if (data.length > 0) {			
				$.each(data, function(i, item) {
					$tableCashAccounts.append("<tr><td>	iban<br>currencyCode<br>accountType<br>currentBalance<br>productDescription</td><td>"
														+ item.iban					+ "<br>"
														+ item.currencyCode			+ "<br>"
														+ item.accountType			+ "<br>"
														+ item.currentBalance		+ "<br>"
														+ item.productDescription
											+ "</td></td>");
											
					$selectIban.append('<option id="' + item.iban + '">' + item.iban + '</option>');
				});
			$collapse3.collapse('show');
			}
			else {
				$tableCashAccounts.append("<tr><td>Es existieren keine Konten!</td><td>");
			}
		});
	});
	
	$getPartner.click(function(){
		
		var $panelPartner = $('#panelPartner');
		var $tablePartner = $('#tablePartner > tbody');
		
		$.ajax({
			url: 'https://simulator-api.db.com:443/gw/dbapi/v1/partners',
			headers: {'Authorization': 'Bearer ' + $input1.val()
			},
		})
		.fail(function (xhr, status, error) {
			$panelPartner.attr("class","panel panel-danger");
			$getPartner.attr("class","btn btn-danger");
			$collapse1.collapse('show');
			$tablePartner.empty();
			$tablePartner.attr("class","text-danger");
			$tablePartner.append('<tr><td>'+ status + '</td><td>' + error + '</td></tr>');
			$tablePartner.append('<tr><td colspan=2>'+ xhr.responseText + '</td></tr>');
		})
		.done(function(data, textStatus, jqXHR) {
			$panelPartner.attr("class","panel panel-success");
			$getPartner.attr("class","btn btn-success");
			$collapse1.collapse('hide');
			$tablePartner.empty();
			$tablePartner.append("<tr><td>partnerType</td><td>"			+ data.partnerType	+ "</td></tr>");
			$.each(data.emailAddresses, function(i, item) {
				$tablePartner.append("<tr><td>" + item.emailAddressType	+ "</td><td>"	+	item.emailAddress	+	"</td></tr>");
			});
			$.each(data.phoneNumbers , function(i, item) {
				$tablePartner.append("<tr><td>" + item.communicationType + "</td><td>" + item.internationalAreaCode	+ " " + item.areaCode + " " + item.telephoneNumber + "</td></tr>");
			});
			
			if (data.partnerType == "NATURAL_PERSON") {
				$tablePartner.append("<tr><td>Akademischer Grad<br>Adelstiel<br>Vorname<br>Nachname<br>Geburtsname<br>Geburtsdatum<br>Geburtsort<br>Nationalität<br>Geschlecht</td><td>"
												+ data.naturalPerson.academicTitle		+ "<br>"
												+ data.naturalPerson.titleOfNobility 	+ "<br>"
												+ data.naturalPerson.firstName 			+ "<br>"
												+ data.naturalPerson.lastName 			+ "<br>"
												+ data.naturalPerson.birthName			+ "<br>"
												+ data.naturalPerson.dateOfBirth		+ "<br>"
												+ data.naturalPerson.birthPlace			+ "<br>"
												+ data.naturalPerson.nationality		+ "<br>"
												+ data.naturalPerson.gender
									+ "</td></tr>");
			}
			else if (data.partnerType == "COMMUNITY") {
			$tablePartner.append("<tr><td>Name der Gemeinschaft</td><td>" + data.community.communityName + "</td></tr>");
			}
			else if (data.partnerType == "ORGANIZATION") {
			$tablePartner.append("<tr><td>Name der Organisation</td><td>" + data.organization.organizationName + "</td></tr>");
			}
		});
	});
	
	$getAgeCertificate.click(function(){
		
		var $panelAgeCertificate = $('#panelAgeCertificate');
		var $tableAgeCertificate = $('#tableAgeCertificate > tbody');
		
		$tableAgeCertificate.empty();
		
		$.ajax({
			url: 'https://simulator-api.db.com:443/gw/dbapi/v1/ageCertificate?certificationMethod=LEGAL_AGE',
			headers: {'Authorization': 'Bearer ' + $input1.val()
			},
		})
		.fail(function (xhr, status, error) {
			$panelAgeCertificate.attr("class","panel panel-danger");
			$getAgeCertificate.attr("class","btn btn-danger");
			$collapse1.collapse('show');
			$tableAgeCertificate.attr("class","text-danger");
			$tableAgeCertificate.append('<tr><td>'+ status + '</td><td>' + error + '</td></tr>');
			$tableAgeCertificate.append('<tr><td colspan=2>'+ xhr.responseText + '</td></tr>');
		})
		.done(function(data, textStatus, jqXHR) {
			$panelAgeCertificate.attr("class","panel panel-success");
			$getAgeCertificate.attr("class","btn btn-success");
			$collapse1.collapse('hide');
			$tableAgeCertificate.append("<tr><td>LEGAL_AGE</td><td>" + data.certified + "</td></tr>");
		});
		
		$.ajax({
			url: 'https://simulator-api.db.com:443/gw/dbapi/v1/ageCertificate?certificationMethod=CRIMINAL_RESPONSIBILITY_AGE',
			headers: {'Authorization': 'Bearer ' + $input1.val()
			},
		})
		.fail(function (xhr, status, error) {
			$panelAgeCertificate.attr("class","panel panel-danger");
			$getAgeCertificate.attr("class","btn btn-danger");
			$collapse1.collapse('show');
			$tableAgeCertificate.attr("class","text-danger");
			$tableAgeCertificate.append('<tr><td>'+ status + '</td><td>' + error + '</td></tr>');
			$tableAgeCertificate.append('<tr><td colspan=2>'+ xhr.responseText + '</td></tr>');
		})
		.done(function(data, textStatus, jqXHR) {
			$panelAgeCertificate.attr("class","panel panel-success");
			$getAgeCertificate.attr("class","btn btn-success");
			$collapse1.collapse('hide');
			$tableAgeCertificate.append("<tr><td>CRIMINAL_RESPONSIBILITY_AGE</td><td>" + data.certified	+ "</td></tr>");
		});
	});
	
$getTransactions.click(function(){
		
		var $panelTransactions = $("#panelTransactions");
		var $tableTransactions = $("#tableTransactions > tbody");
		
		var $selectedIban = $selectIban.find("option:selected").text();
		
		if ($selectedIban != "") {
				
			$.ajax({
				url: "https://simulator-api.db.com:443/gw/dbapi/v1/transactions?iban=" + $selectedIban,
				headers: {"Authorization": "Bearer " + $input1.val()
				},
			})
			.fail(function (xhr, status, error) {
				$panelTransactions.attr("class","panel panel-danger");
				$getTransactions.attr("class","btn btn-danger");
				$collapse1.collapse('show');
				$tableTransactions.empty();
				$tableTransactions.attr("class","text-danger");
				$tableTransactions.append('<tr><td>'+ status + '</td><td>' + error + '</td></tr>');
				$tableTransactions.append('<tr><td colspan=2>'+ xhr.responseText + '</td></tr>');
			})
			
			.done(function(data, textStatus, jqXHR) {
				$panelTransactions.attr("class","panel panel-success");
				$getTransactions.attr("class","btn btn-success");
				$collapse1.collapse('hide');
				$tableTransactions.empty();
				
				if (data.length > 0) {
					$.each(data, function(i, item) {
						$tableTransactions.append("<tr><td>originIban<br>amount<br>counterPartyName<br>counterPartyIban<br>paymentReference<br>bookingDate<br>currencyCode<br>transactionCode<br>externalBankTransactionDomainCode<br>externalBankTransactionFamilyCode<br>externalBankTransactionSubFamilyCode<br>mandateReference<br>creditorId</td><td>"
															+ item.originIban 								+ "<br>"
															+ item.amount 									+ "<br>"
															+ item.counterPartyName							+ "<br>"
															+ item.counterPartyIban 						+ "<br>"
															+ item.paymentReference 						+ "<br>"
															+ item.bookingDate		 						+ "<br>"
															+ item.currencyCode 	 						+ "<br>"
															+ item.transactionCode  						+ "<br>"
															+ item.externalBankTransactionDomainCode		+ "<br>"
															+ item.externalBankTransactionFamilyCode  		+ "<br>"
															+ item.externalBankTransactionSubFamilyCode  	+ "<br>"
															+ item.mandateReference   						+ "<br>"
															+ item.creditorId
												+ "</td></td>");
					})
				}
				else {
					$tableTransactions.append("<tr><td>2Es liegen keine Transaktionen im betrachteten Zeitraum vor!</td><td>");
				}
			})
		}
		else {
			$panelTransactions.attr("class","panel panel-danger");
			$getTransactions.attr("class","btn btn-danger");
			$collapse2.collapse('show');
			$tableTransactions.empty();
			$tableTransactions.attr("class","text-danger");
			$tableTransactions.append('<tr><td>Es wurden keine Konten geladen. Bitte erst Button "Konten laden" drücken!</td></tr>');
		}
	});
	
});


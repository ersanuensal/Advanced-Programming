function genTableEnterForm(enterFormAll) {

  		var col = [];
		// Überprüfen der Lange und der Inhalte der JSON
        for (var i = 0; i < enterFormAll.length; i++) {
            for (var key in enterFormAll[i]) {
            	if (key == "vorname" || key == "nachname" || key == "yn"){

					if (col.indexOf(key) === -1) {
                   		col.push(key);
               		}

                }
            }
        }

        var table = document.createElement("table");

        var tr = table.insertRow(-1);

        //	Schleife um den Kopf der Tabelle zu generieren
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");

			if (col[i] == "yn") {
				th.innerHTML = "Teilnahme: ";
            	tr.appendChild(th);

			} else if (col[i] == "vorname") {
				th.innerHTML = "Vorname: ";
            	tr.appendChild(th);

			} else if (col[i] == "nachname") {
				th.innerHTML = "Nachname: ";
            	tr.appendChild(th);

			} else {
				th.innerHTML = col[i];
            	tr.appendChild(th);
			}


        }

		// Schleife um die Einträge in die Tabelle hinzu zu fügen.
        for (var i = 0; i < enterFormAll.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
				if (enterFormAll[i][col[j]] == true) {
					tabCell.innerHTML = "Ja";
				} else if (enterFormAll[i][col[j]] == false) {
					tabCell.innerHTML = "Nein";
				} else {
					tabCell.innerHTML = enterFormAll[i][col[j]];
				}

            }
        }

		// Auf der HTML Seite anzeigen
        var divShowData = document.getElementById('showData');
        divShowData.innerHTML = "";
        divShowData.appendChild(table);

  	}

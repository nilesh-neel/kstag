function order_by_occurrence(arr) {
    var counts = {};
    arr.forEach(function(value) {
        if (!counts[value]) {
            counts[value] = 0;
        }
        counts[value]++;
    });

    // return Object.keys(counts).sort(function(curKey, nextKey) {
    //     return counts[curKey] < counts[nextKey];
    // });

    return Object.keys(counts).filter((a) => counts[a] > 1)
}


(function() {
    if ($('#barcode-scanner').length > 0 && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {

        var last_result = [];
        if (Quagga.initialized == undefined) {
            Quagga.onDetected(function(result) {
                var last_code = result.codeResult.code;
                last_result.push(last_code);
                if (last_result.length > 20) {
                    code = order_by_occurrence(last_result)[0];
                    last_result = [];
                    Quagga.stop();
                    $('#divBarcode').text(code);
                }
            });
        }

        Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    numOfWorkers: navigator.hardwareConcurrency,
                    target: document.querySelector('#barcode-scanner')
                },
                decoder: {
                    readers: [{
                            format: "i2of5_reader",
                            config: {}
                        }, {
                            format: "i2of5",
                            config: {}
                        }

                    ]
                }
            },
            function(err) {
                if (err) { console.log(err); return }
                Quagga.initialized = true;
                Quagga.start();
            });

    }

})();
document.addEventListener('DOMContentLoaded', function() {
    // Formatação de valores monetários
    function formatarMoeda(valor) {
        if (!valor) return '0,00';
        valor = valor.replace(/\D/g, '');
        valor = (parseFloat(valor) / 100).toFixed(2);
        return valor.replace('.', ',');
    }

    // Formatação de campos monetários
    ['valorSolicitado', 'taxaCadastro', 'seguro'].forEach(id => {
        const campo = document.getElementById(id);
        campo.addEventListener('input', function(e) {
            let valor = e.target.value;
            e.target.value = formatarMoeda(valor);
        });
    });

    // Formatação de taxa
    ['taxaJuros', 'incrementoTaxa'].forEach(id => {
        const campo = document.getElementById(id);
        campo.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            if (!valor) return;
            valor = (parseFloat(valor) / 100).toFixed(2);
            e.target.value = valor.replace('.', ',');
        });
    });

    // Controle do checkbox principal
    document.getElementById('simularMaisParcelas').addEventListener('change', function(e) {
        const opcoesSimulacao = document.getElementById('opcoesSimulacao');
        const checkboxesParcelas = document.querySelectorAll('.parcelas-adicionais');
        const incrementoTaxa = document.getElementById('incrementoTaxa');
        
        if (this.checked) {
            opcoesSimulacao.style.display = 'block';
            checkboxesParcelas.forEach(checkbox => {
                checkbox.checked = true;
                checkbox.disabled = true;
            });
            incrementoTaxa.disabled = false;
        } else {
            opcoesSimulacao.style.display = 'none';
            checkboxesParcelas.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.disabled = true;
            });
            incrementoTaxa.disabled = true;
            incrementoTaxa.value = '';
        }
    });

    // Variável global para armazenar os dados da última simulação
    let dadosSimulacao = null;

    // Envio do formulário
<<<<<<< HEAD
    document.getElementById('formSimulador').addEventListener('submit', function(e) {
        e.preventDefault();
        
=======
    /**
     * Handles the submission of the loan simulator form and performs the loan calculation.
     * This function is triggered when the user submits the form with the loan details.
     * It validates the required fields, collects the form data, sends it to the backend for calculation,
     * and then displays the results of the simulation.
     */
    document.getElementById('formSimulador').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validação dos campos obrigatórios
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418
        const camposObrigatorios = ['dataLiberacao', 'dataPrimeiraParcela', 'valorSolicitado', 'taxaJuros', 'qtdParcelas'];
        for (const campo of camposObrigatorios) {
            if (!document.getElementById(campo).value) {
                alert(`Por favor, preencha o campo ${campo}`);
                return;
            }
        }

        const simularMaisParcelas = document.getElementById('simularMaisParcelas').checked;
        
        const dados = {
            dataLiberacao: document.getElementById('dataLiberacao').value,
            dataPrimeiraParcela: document.getElementById('dataPrimeiraParcela').value,
            valorSolicitado: document.getElementById('valorSolicitado').value || '0,00',
            taxaCadastro: document.getElementById('taxaCadastro').value || '0,00',
            seguro: document.getElementById('seguro').value || '0,00',
            taxaJuros: document.getElementById('taxaJuros').value,
            qtdParcelas: document.getElementById('qtdParcelas').value,
            simulacoes: {
                sim24: simularMaisParcelas,
                sim36: simularMaisParcelas,
                sim48: simularMaisParcelas,
                sim60: simularMaisParcelas
            },
            incrementoTaxa: simularMaisParcelas ? document.getElementById('incrementoTaxa').value : '0,00'
        };

<<<<<<< HEAD
=======
        console.log('Dados enviados para simulação:', dados);  // ADICIONE AQUI

>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418
        fetch('/calcular', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(data => {
<<<<<<< HEAD
            console.log('Resposta completa do backend:', data);
            console.log('Data.data:', data.data);
            console.log('Simulações:', data.data?.simulacoes);
        
            if (data.status === 'success') {
                dadosSimulacao = data.data;
=======
            console.log('Resposta completa do backend:', data);  // ADICIONE AQUI
            console.log('Data.data:', data.data);  // ADICIONE AQUI
            console.log('Simulações:', data.data?.simulacoes);  // ADICIONE AQUI
            if (data.status === 'success') {
                dadosSimulacao = data.data; // Armazena os dados para exportação
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418
                mostrarResultados(data.data);
            } else {
                alert('Erro ao calcular: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao processar a requisição');
        });
<<<<<<< HEAD
        
=======
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418
    });

    function mostrarResultados(dados) {
        const resultadosDiv = document.getElementById('resultados');
        
<<<<<<< HEAD
=======
        // Função auxiliar para formatar valores
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418
        const formatarValor = (valor) => {
            return valor ? valor.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0,00';
        };
    
        let html = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>Resultados da Simulação</h5>
                <button class="btn btn-success" onclick="exportarParaExcel()">
                    <i class="fas fa-file-excel"></i> Exportar para Excel
                </button>
            </div>
    
            <div class="mb-4">
                <h5>Resumo do Financiamento</h5>
                <table class="table table-bordered">
                    <tbody>
                        <tr>
                            <th width="30%">Valor Financiado</th>
                            <td>R$ ${formatarValor(dados.valor_financiado)}</td>
                        </tr>
                        <tr>
                            <th>Taxa de Juros</th>
                            <td>${dados.taxa_juros}% ao mês</td>
                        </tr>
                        <tr>
                            <th>Total de Juros</th>
                            <td>R$ ${formatarValor(dados.total_juros)}</td>
                        </tr>
                        <tr>
                            <th>Quantidade de Parcelas</th>
                            <td>${dados.fluxo.length}</td>
                        </tr>
                        <tr>
                            <th>Valor da Parcela</th>
                            <td>R$ ${formatarValor(dados.prestacao)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
    
        if (dados.simulacoes && dados.simulacoes.length > 0) {
<<<<<<< HEAD
            localStorage.setItem('ultimaSimulacao', JSON.stringify(dados));
            
            html += `
                <div class="mb-4">
                    <h5>Simulações em Outras Parcelas</h5>
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Parcelas</th>
                                    <th>Taxa (%)</th>
                                    <th>Valor Parcela</th>
                                    <th>Total Juros</th>
                                    <th>Valor Financiado</th>
                                </tr>
                            </thead>
                            <tbody>`;
=======
            html += `
                <div class="mb-4">
                    <h5>Simulações em Outras Parcelas</h5>
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Parcelas</th>
                                <th>Taxa</th>
                                <th>Valor Parcela</th>
                                <th>Total Juros</th>
                            </tr>
                        </thead>
                        <tbody>`;
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418
            
            dados.simulacoes.forEach(simulacao => {
                html += `
                    <tr>
                        <td>${simulacao.qtd_parcelas}x</td>
<<<<<<< HEAD
                        <td>${formatarValor(simulacao.taxa_juros)}</td>
                        <td>R$ ${formatarValor(simulacao.valor_parcela)}</td>
                        <td>R$ ${formatarValor(simulacao.total_juros)}</td>
                        <td>R$ ${formatarValor(simulacao.valor_total)}</td>
                    </tr>`;
            });

            html += `
                            </tbody>
                        </table>
                    </div>
                    <button type="button" class="btn btn-secondary mt-3" onclick="exportarSimulacoesAdicionais()">
                        Exportar Simulações
                    </button>
=======
                        <td>${simulacao.taxa_juros}%</td>
                        <td>R$ ${formatarValor(simulacao.valor_parcela)}</td>
                        <td>R$ ${formatarValor(simulacao.total_juros)}</td>
                    </tr>`;
            });
    
            html += `
                        </tbody>
                    </table>
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418
                </div>`;
        }
    
        html += `
            <h5>Detalhamento das Parcelas</h5>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Parcela</th>
                        <th>Data</th>
                        <th>Valor Parcela</th>
                        <th>Amortização</th>
                        <th>Juros</th>
                        <th>Saldo Devedor</th>
                    </tr>
                </thead>
                <tbody>`;
        
        dados.fluxo.forEach(parcela => {
            html += `
                <tr>
                    <td>${parcela.parcela}</td>
                    <td>${parcela.data}</td>
                    <td>R$ ${formatarValor(dados.prestacao)}</td>
                    <td>R$ ${formatarValor(parcela.amortizacao)}</td>
                    <td>R$ ${formatarValor(parcela.juros)}</td>
                    <td>R$ ${formatarValor(parcela.saldo_devedor)}</td>
                </tr>`;
        });
        
        html += `
                </tbody>
            </table>`;
    
        resultadosDiv.innerHTML = html;
    }
<<<<<<< HEAD
=======
    
    
    
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418

    window.exportarParaExcel = function() {
        if (!dadosSimulacao) {
            alert('Não há dados para exportar');
            return;
        }
    
<<<<<<< HEAD
=======
        // Função auxiliar para formatar números no padrão brasileiro
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418
        const formatarNumero = (numero) => {
            return numero.toFixed(2).replace('.', ',');
        };
        
<<<<<<< HEAD
        let csvContent = 'Parcela;Data;Valor Parcela;Amortização;Juros;Saldo Devedor\n';
        
=======
        // Cria o cabeçalho do CSV
        let csvContent = 'Parcela;Data;Valor Parcela;Amortização;Juros;Saldo Devedor\n';
        
        // Adiciona os dados de cada parcela
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418
        dadosSimulacao.fluxo.forEach(parcela => {
            csvContent += `${parcela.parcela};${parcela.data};${formatarNumero(dadosSimulacao.prestacao)};${formatarNumero(parcela.amortizacao)};${formatarNumero(parcela.juros)};${formatarNumero(parcela.saldo_devedor)}\n`;
        });
    
<<<<<<< HEAD
=======
        // Cria o blob e faz o download
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'simulacao_financiamento.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };
<<<<<<< HEAD
});

// Nova função para exportar simulações adicionais
window.exportarSimulacoesAdicionais = function() {
    const dadosSimulacao = JSON.parse(localStorage.getItem('ultimaSimulacao'));
    if (!dadosSimulacao) return;

    const formatarValorExport = (valor) => {
        return valor.toFixed(2).replace('.', ',');
    };

    let conteudo = 'Parcelas;Taxa;Valor Parcela;Total Juros;Total Financiado\n';
    
    // Adiciona simulação original
    conteudo += `${dadosSimulacao.fluxo.length};${formatarValorExport(dadosSimulacao.taxa_juros)};${formatarValorExport(dadosSimulacao.prestacao)};${formatarValorExport(dadosSimulacao.total_juros)};${formatarValorExport(dadosSimulacao.valor_financiado)}\n`;
    
    // Adiciona simulações adicionais
    dadosSimulacao.simulacoes.forEach(sim => {
        conteudo += `${sim.qtd_parcelas};${formatarValorExport(sim.taxa_juros)};${formatarValorExport(sim.valor_parcela)};${formatarValorExport(sim.total_juros)};${formatarValorExport(sim.valor_total)}\n`;
    });
    
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulacoes_adicionais.txt';
    a.click();
    window.URL.revokeObjectURL(url);
};
=======
    
});
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418

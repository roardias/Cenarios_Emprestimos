from flask import render_template, jsonify, request
from app import app
from app.calculadora.calculo_financiamento import CalculadoraFinanciamento
from datetime import datetime
import locale

locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calcular', methods=['POST'])
def calcular():
    try:
        data = request.get_json()
        
        # Converter data para formato dd/mm/yyyy
        data_liberacao = datetime.strptime(data['dataLiberacao'], '%Y-%m-%d').strftime('%d/%m/%Y')
        data_primeira_parcela = datetime.strptime(data['dataPrimeiraParcela'], '%Y-%m-%d').strftime('%d/%m/%Y')
        
<<<<<<< HEAD
        # Verifica se tem simulações adicionais
        simular_mais_parcelas = any(data['simulacoes'].values())
        incremento_taxa = float(data['incrementoTaxa'].replace(',', '.')) if simular_mais_parcelas else 0
        
=======
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418
        calculadora = CalculadoraFinanciamento(
            valor_solicitado=float(data['valorSolicitado'].replace('.', '').replace(',', '.')),
            taxa_cadastro=float(data['taxaCadastro'].replace('.', '').replace(',', '.')),
            seguro=float(data['seguro'].replace('.', '').replace(',', '.')),
            data_liberacao=data_liberacao,
            data_primeira_parcela=data_primeira_parcela,
            qtd_parcelas=int(data['qtdParcelas']),
            taxa_juros=float(data['taxaJuros'].replace(',', '.'))
        )
        
<<<<<<< HEAD
        resultado = calculadora.calcular(simular_mais_parcelas, incremento_taxa)
=======
        resultado = calculadora.calcular()
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418
        return jsonify({'status': 'success', 'data': resultado})
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

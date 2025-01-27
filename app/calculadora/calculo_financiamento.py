from datetime import datetime, timedelta
from calendar import monthrange
import math
import logging
from decimal import Decimal

class CalculadoraFinanciamento:
    def __init__(self, valor_solicitado, taxa_cadastro, seguro, data_liberacao, data_primeira_parcela, qtd_parcelas, taxa_juros):
        self.valor_solicitado = valor_solicitado
<<<<<<< HEAD
        self.valor_solicitado_original = valor_solicitado
=======
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418
        self.taxa_cadastro = taxa_cadastro
        self.seguro = seguro
        self.data_liberacao = datetime.strptime(data_liberacao, '%d/%m/%Y')
        self.data_primeira_parcela = datetime.strptime(data_primeira_parcela, '%d/%m/%Y')
        self.qtd_parcelas = qtd_parcelas
        self.taxa_juros = taxa_juros

    def calcular_valor_financiado_provisorio(self):
        return self.valor_solicitado + self.taxa_cadastro + self.seguro

    def gerar_datas_vencimento(self):
        datas_vencimento = []
        dia_base = self.data_primeira_parcela.day
        mes_atual = self.data_primeira_parcela.month
        ano_atual = self.data_primeira_parcela.year

        for i in range(self.qtd_parcelas):
            if i == 0:
                datas_vencimento.append(self.data_primeira_parcela)
                continue

            mes_atual += 1
            if mes_atual > 12:
                mes_atual = 1
                ano_atual += 1

            _, ultimo_dia = monthrange(ano_atual, mes_atual)
            dia_vencimento = min(dia_base, ultimo_dia)

            data_vencimento = datetime(ano_atual, mes_atual, dia_vencimento)
            datas_vencimento.append(data_vencimento)

        return datas_vencimento

    def calcular_dias(self):
        datas_vencimento = self.gerar_datas_vencimento()
        dias_acumulados = []
        dias_entre_parcelas = []

        for data in datas_vencimento:
            dias = (data - self.data_liberacao).days
            dias_acumulados.append(dias)

        dias_entre_parcelas.append((datas_vencimento[0] - self.data_liberacao).days)
        for i in range(1, len(datas_vencimento)):
            dias = (datas_vencimento[i] - datas_vencimento[i-1]).days
            dias_entre_parcelas.append(dias)

        return {
            'dias_acumulados': dias_acumulados,
            'dias_entre_parcelas': dias_entre_parcelas
        }

    def calcular_fatores(self):
        dias_acumulados = self.calcular_dias()['dias_acumulados']
        fatores = []
        
        for dias in dias_acumulados:
            expoente = dias / 30
            denominador = math.pow(1 + (self.taxa_juros/100), expoente)
            fator = 1 / denominador
            fatores.append(fator)
            
        return fatores

    def calcular_coeficiente(self):
        fatores = self.calcular_fatores()
        soma_fatores = sum(fatores)
        coeficiente = 1 / soma_fatores
        return coeficiente

    def calcular_prestacao(self, valor_financiado=None):
        if valor_financiado is None:
            valor_financiado = self.calcular_valor_financiado_provisorio()
        
        coeficiente = self.calcular_coeficiente()
        return valor_financiado * coeficiente


    def calcular_taxa_equivalente(self, dias_entre_parcelas):
        taxa_mensal = self.taxa_juros / 100
        taxa_equivalente = (1 + taxa_mensal) ** (dias_entre_parcelas / 30) - 1
        return taxa_equivalente

    def calcular_fluxo_pagamentos(self, valor_financiado=None):
        if valor_financiado is None:
            prestacao = self.calcular_prestacao()
            saldo_devedor = self.calcular_valor_financiado_provisorio()
        else:
            # Recalcula com o valor financiado final (incluindo IOF)
            self.valor_solicitado = valor_financiado - self.taxa_cadastro - self.seguro
            prestacao = self.calcular_prestacao()
            saldo_devedor = valor_financiado

        dias = self.calcular_dias()
        fluxo = []
        
        for i in range(self.qtd_parcelas):
            taxa_equivalente = self.calcular_taxa_equivalente(dias['dias_entre_parcelas'][i])
            juros = saldo_devedor * taxa_equivalente
            amortizacao = prestacao - juros
            saldo_devedor = saldo_devedor - amortizacao
            
            fluxo.append({
                'parcela': i + 1,
                'taxa_equivalente': taxa_equivalente,
                'juros': juros,
                'amortizacao': amortizacao,
                'saldo_devedor': saldo_devedor if saldo_devedor > 0 else 0
            })
        return fluxo


    def calcular_iof(self):
        fluxo = self.calcular_fluxo_pagamentos()
        dias = self.calcular_dias()
        
        iof_diario_total = Decimal('0')
        aliquota_iof = Decimal('0.0082') / Decimal('100')
        
        for i, dados in enumerate(fluxo):
            dias_acumulados = dias['dias_acumulados'][i]
            valor_amortizacao = Decimal(str(dados['amortizacao']))
            
            # Cálculo do IOF diário com base nos dias acumulados
            iof_diario_parcela = Decimal(str(dias_acumulados)) * valor_amortizacao * aliquota_iof
            
            # Limite de 3% para operações com prazo superior a 365 dias
            if dias_acumulados > 365:
                limite_3_porcento = valor_amortizacao * Decimal('0.03')
                iof_diario_parcela = min(iof_diario_parcela, limite_3_porcento)
            
            iof_diario_total += iof_diario_parcela
        
        # IOF adicional de 0.38%
        valor_financiado_provisorio = self.calcular_valor_financiado_provisorio()
        iof_adicional = Decimal(str(valor_financiado_provisorio)) * (Decimal('0.38') / Decimal('100'))
        
        iof_total = iof_diario_total + iof_adicional
        
        return {
            'iof_diario': float(iof_diario_total),
            'iof_adicional': float(iof_adicional),
            'iof_total': float(iof_total)
        }


    def calcular_valor_financiado_final(self):
        valor_financiado_provisorio = self.calcular_valor_financiado_provisorio()
        iof = self.calcular_iof()
        return valor_financiado_provisorio + iof['iof_total']

<<<<<<< HEAD
    def calcular(self, simular_mais_parcelas=False, incremento_taxa=0):
=======
    def calcular(self):
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418
        # Primeiro cálculo para encontrar o IOF
        valor_financiado_provisorio = self.calcular_valor_financiado_provisorio()
        dias = self.calcular_dias()
        fluxo_provisorio = self.calcular_fluxo_pagamentos()
        iof = self.calcular_iof()
        
        # Cálculo final com o valor do IOF incluído
        valor_financiado_final = valor_financiado_provisorio + iof['iof_total']
        fluxo_final = self.calcular_fluxo_pagamentos(valor_financiado_final)
        prestacao_final = self.calcular_prestacao(valor_financiado_final)
        
<<<<<<< HEAD
        resultado = {
            'valor_financiado': float(valor_financiado_final),
            'prestacao': float(prestacao_final),
            'taxa_juros': float(self.taxa_juros),  # Adicionando taxa de juros original
            'total_juros': sum(float(dados['juros']) for dados in fluxo_final),  # Adicionando total de juros
=======
        return {
            'valor_financiado': float(valor_financiado_final),
            'prestacao': float(prestacao_final),
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418
            'fluxo': [
                {
                    'parcela': i + 1,
                    'data': data.strftime('%d/%m/%Y'),
                    'amortizacao': float(dados['amortizacao']),
                    'juros': float(dados['juros']),
                    'saldo_devedor': float(dados['saldo_devedor'])
                }
                for i, (data, dados) in enumerate(zip(self.gerar_datas_vencimento(), fluxo_final))
            ],
            'iof': iof
        }

<<<<<<< HEAD
        if simular_mais_parcelas:
            parcelas_adicionais = [24, 36, 48, 60]
            resultado['simulacoes'] = self.calcular_simulacoes_adicionais(incremento_taxa, parcelas_adicionais)

        return resultado

    
    def calcular_simulacoes_adicionais(self, incremento_taxa, parcelas_adicionais):
        simulacoes = []
        taxa_atual = self.taxa_juros + incremento_taxa
        
        for qtd_parcelas in parcelas_adicionais:
            valor_financiado_provisorio = self.valor_solicitado_original  + self.taxa_cadastro + self.seguro
            
            nova_simulacao = CalculadoraFinanciamento(
                self.valor_solicitado_original,
                self.taxa_cadastro,
                self.seguro,
                self.data_liberacao.strftime('%d/%m/%Y'),
                self.data_primeira_parcela.strftime('%d/%m/%Y'),
                qtd_parcelas,
                taxa_atual
            )
            
            iof = nova_simulacao.calcular_iof()
            valor_financiado_final = valor_financiado_provisorio + iof['iof_total']
            resultado = nova_simulacao.calcular()
            
            simulacao = {
                'qtd_parcelas': qtd_parcelas,
                'taxa_juros': taxa_atual,
                'valor_parcela': resultado['prestacao'],
                'total_juros': sum(parcela['juros'] for parcela in resultado['fluxo']),
                'valor_total': valor_financiado_final,
                'detalhes_iof': {
                    'valor_financiado_provisorio': valor_financiado_provisorio,
                    'valores_base': {
                        'valor_solicitado': self.valor_solicitado,
                        'taxa_cadastro': self.taxa_cadastro,
                        'seguro': self.seguro
                    },
                    'iof_diario': iof['iof_diario'],
                    'iof_adicional': iof['iof_adicional'],
                    'iof_total': iof['iof_total'],
                    'valor_financiado_final': valor_financiado_final
                }
            }
            simulacoes.append(simulacao)
            
            taxa_atual += incremento_taxa
        
        return simulacoes
=======
>>>>>>> d4891affea258b1df5848f70a13ef7c2a3b58418

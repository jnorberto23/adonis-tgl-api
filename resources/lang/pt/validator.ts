export default class MessagesCustom {
  public messages = {
    above: '{{field}} deve ser acima de {{argument.0}}.',
    accepted: '{{field}} deve ter sido aceito',
    after: '{{field}} deve ser uma data após {{argument.0}}',
    after_offset_of:
      '{{field}} deve ser mais recente que {{argument.0}} {{argument.1}} a partir da data atual',
    alpha: '{{field}} deve conter apenas letras',
    alpha_numeric: '{{field}} deve conter apenas letras e números',
    array: '{{field}} deve ser um ARRAY.',
    before: '{{field}} deve ser uma data anterior a {{argument.0}}.',
    before_offset_of:
      '{{field}} deve ser aterior a {{argument.0}} {{argument.1}} a partir da data de hoje',
    between: '{{field}} deve estar entre {{argument.0}} e {{argument.1}}.',
    boolean: '{{field}} deve ser um valor lógico Verdadeiro ou Falso.',
    confirmed: '{{field}} não foi confirmado corretamente.',
    date: '{{field}} deve ser uma data válida',
    date_format: '{{field}} deve ser uma data válida conforme o formato  {{argument.0}}.',
    different: '{{field}} e {{argument.0}} devem ser diferentes.',
    email: '{{field}} deve ser um e-mail válido.',
    ends_with: '{{field}} deve terminar com ({{argument}}).',
    equals: '{{field}} deve ser igual a {{argument.0}}.',
    in: '{{field}} deve estar entre os valores ({{argument}}).',
    includes: '{{field}} deve conter: ({{argument}}).',
    integer: '{{field}} deve ser um número INTEIRO.',
    ip: '{{field}} deve ser um endereço IP válido.',
    ipv4: '{{field}} deve ser um endereço IPV4 válido.',
    ipv6: '{{field}} deve ser um endereço IPV6 válido.',
    json: '{{field}} deve estar em formato JSON válido.',
    max: '{{field}} não deve ser maior que {{argument.0}}.',
    min: '{{field}} não deve ser menor que {{argument.0}}.',
    not_equals: '{{field}} deve ser diferente de {{argument.0}}.',
    not_in: '{{field}} não pode estar entre: ({{argument}}).',
    object: '{{field}} deve ser um OBJETO válido.',
    range: '{{field}} deve estar entre {{argument.0}} e {{argument.1}}.',
    regex: 'O formato de {{field}} é inválido.',
    required: '{{field}} é obrigatório e está faltando.',
    required_if: '{{field}} é obrigatório quando {{argument.0}} existir.',
    required_when:
      '{{field}} é obrigatório quando o valor de: {{argument.0}} for igual a {{argument.1}}',
    required_with_all: '{{field}} é obrigatório quando todos: ({{argument}}) estiverem presentes.',
    required_with_any:
      '{{field}} é obrigatório quando pelo menos destes: ({{argument}}) estiver presente.',
    required_without_all:
      '{{field}} é obrigatório quando nenhum destes: ({{argument}}) estiver presente.',
    required_without_any:
      '{{field}} é obrigatório quando algum destes: ({{argument}}) estiver presente.',
    same: '{{field}} e {{argument.0}} devem ser iguais.',
    starts_with: '{{field}} deve começar com as letras: ({{argument}}).',
    string: '{{field}} deve ser uma STRING.',
    under: '{{field}} precisa ser abaixo de {{argument.0}}.',
    unique: '{{field}} já existe e precisa ser único.',
    url: 'URL inválida.',
  }
}
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "whatsapp-session-id",
        storagePath: './wwebjs_auth'
    })
});

client.on('authenticated', (session) => {
    console.log('Sessão autenticada e salva com sucesso!');
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));

function dentroDoHorarioComercial() {
    const agora = new Date();
    const dia = agora.getDay();
    const hora = agora.getHours();
    const minuto = agora.getMinutes();

    if (dia >= 1 && dia <= 4) {
        return (
            (hora > 7 && hora < 11) ||
            (hora === 7 && minuto >= 0) ||
            (hora === 11 && minuto <= 30) ||
            (hora > 13 && hora < 17) ||
            (hora === 13 && minuto >= 0) ||
            (hora === 17 && minuto <= 30)
        );
    }

    if (dia === 5) {
        return (
            (hora > 7 && hora < 11) ||
            (hora === 7 && minuto >= 0) ||
            (hora === 11 && minuto <= 30) ||
            (hora > 13 && hora < 16) ||
            (hora === 13 && minuto >= 0) ||
            (hora === 16 && minuto <= 30)
        );
    }

    return false;
}

client.on('message', async msg => {
    if (msg.body.match(/(menu|Menu|oi|Oi|olá|Olá|ola|Ola|bom dia|boa tarde|boa noite)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        if (!dentroDoHorarioComercial()) {
            await client.sendMessage(
                msg.from,
                'Olá! Não estamos disponíveis no momento.\n\n' +
                'Nosso horário de atendimento é:\n' +
                'Segunda a quinta - 07:00 às 11:30 e das 13:00 às 17:30\n' +
                'Sexta - 07:00 às 11:30 e das 13:00 às 16:30.\n\n' +
                'Assim que estivermos online, responderemos sua mensagem. Obrigado pelo contato!'
            );
            return;
        }

        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        const contact = await msg.getContact();
        const name = contact.pushname;

        await client.sendMessage(
            msg.from,
            'Olá! ' + name.split(" ")[0] + ', seja bem-vindo à *Viacelli Ind. e Comércio!*\n\n' +
            'Para te atendermos melhor, escolha uma opção:\n\n' +
            '1 - *Vendas/Compras/Pós-venda*\n' +
            '2 - *Financeiro*\n' +
            '3 - *RH*\n' +
            '4 - *Visitar nosso Instagram*\n\n' +
            'Por favor, responda com o número da opção.'
        );
    }

    if (msg.body === '1') {
        await client.sendMessage(
            msg.from,
            'Ótimo! Você será atendido por *Augusto*, do setor de *Vendas/Compras e Pós-venda*.\n\nAguarde um momento, ele já vai te responder.'
        );
    }

    if (msg.body === '2') {
        await client.sendMessage(
            msg.from,
            'Perfeito! A *Fabíola*, do setor *Financeiro*, vai te atender em instantes.\n\nAguarde só um pouquinho!'
        );
    }

    if (msg.body === '3') {
        await client.sendMessage(
            msg.from,
            'Legal! A responsável pelo setor de *RH* é a *Kelly*.\n\nEla já foi avisada e vai falar com você em breve.'
        );
    }

    if (msg.body === '4') {
        await client.sendMessage(
            msg.from,
            '✨ Que bom que você quer conhecer mais sobre a gente!\n\n' +
            'Acesse nosso Instagram clicando aqui: https://www.instagram.com/viacelliindustria\n\n' +
            'Fique à vontade para nos seguir e acompanhar as novidades!'
        );
    }
});


const logger = require("../../../logger");
const config = require("../../../config");
const { Api } = require('telegram');
const editDict = require("../../i18n/edtB10");


const forceSub = async ({client, update }) => {
    try{
        if (!config.CHANNEL_INFO.FORCE_SUB && !config.CHANNEL_INFO.REQUEST_URL){
            return true;
        }
        if (config.CHANNEL_INFO.FORCE_SUB) {
            const result = await client.invoke(
                new Api.channels.GetParticipant({
                    channel: config.CHANNEL_INFO.FORCE_SUB,
                    participant: update.message.chatId.value
                })
            );
        }
    } catch (error) {

        let lang_code = await getLang(update.message.chatId);
        let translated = await translate({
            text: 'force.message', button: 'force.button',
            langCode: lang_code, asString: true
        });

        let newButton = await editDict({
            inDict : translated.button,
            value : config.CHANNEL_INFO.FORCE_URL
        })
        newButton = await createButton({
            button : newButton, order : '11'
        })

        await client.sendMessage(update.message.chatId, {
            message: translated.text,
            buttons: client.buildReplyMarkup(
                newButton
            ),
            replyTo: update.message.id
        });

        logger.log('info', `${update.message.chatId} cause error: ${error.message}`);
    }
};

module.exports = { forceSub };
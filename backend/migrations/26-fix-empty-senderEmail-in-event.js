const { mongoose } = require('@novel-systems/shared')
const Promise = require('bluebird')

module.exports = {
    index: 26,
    name: '26-fix-empty-senderEmail-in-event',
    description: 'Replace empty senderEmail with noreply@novel.systems',
    run: async () => {
        // Update emailConfig.senderEmail field for documents with an empty senderEmail
        const resSenderEmail = await mongoose
            .model('Event')
            .updateMany(
                { 'emailConfig.senderEmail': { $in: [null, ""] } },
                {
                    $set: {
                        'emailConfig.senderEmail': "noreply@novel.systems"
                    }
                }
            )

        console.log('Done updating empty senderEmail fields', resSenderEmail.n, resSenderEmail.nModified)

        return Promise.resolve()
    },
}

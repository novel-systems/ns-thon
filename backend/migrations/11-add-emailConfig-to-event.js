const { mongoose } = require('@novel-systems/shared')
const Promise = require('bluebird')

module.exports = {
    index: 11,
    name: '11-add-emailConfig-to-event',
    description: 'Add emailConfig to event',
    run: async () => {
        // Update emailConfig field
        const resEmailConfig = await mongoose.model('Event').updateMany(
            { emailConfig: { $exists: false } },
            {
                $set: {
                    emailConfig: {
                        senderName: '',
                        senderEmail: 'noreply@novel.systems',
                        acceptanceEmail: {
                            title: '',
                            subtitle: '',
                            body: '',
                        },
                        rejectionEmail: {
                            title: '',
                            subtitle: '',
                            body: '',
                        },
                        registrationEmail: {
                            title: '',
                            subtitle: '',
                            body: '',
                        },
                    },
                },
            },
        )
        console.log(
            'Done updating emailConfig field',
            resEmailConfig.n,
            resEmailConfig.nModified,
        )

        return Promise.resolve()
    },
}

const { mongoose } = require('@novel-systems/shared')
const mongooseSlugPlugin = require('mongoose-slug-plugin')
const {
    EventTypes,
    ReviewingMethods,
    OverallReviewingMethods,
} = require('@novel-systems/shared')
// const AddressSchema = require('@novel-systems/shared/schemas/Address')
const ChallengeSchema = require('@novel-systems/shared/schemas/Challenge')
const HackerpackSchema = require('@novel-systems/shared/schemas/Hackerpack')
const CloudinaryImageSchema = require('@novel-systems/shared/schemas/CloudinaryImage')
const Certificate = require('@novel-systems/shared/schemas/Certificate')
const mongoFile = require('@novel-systems/shared/schemas/MongoFile')
const RegistrationSectionSchema = require('@novel-systems/shared/schemas/RegistrationSection')
const TrackSchema = require('@novel-systems/shared/schemas/Track')
const EventRecruitersSchema = require('@novel-systems/shared/schemas/Recruiter')
const TravelGrantConfigSchema = require('@novel-systems/shared/schemas/TravelGrantConfig')
const UserDetailsConfigSchema = require('@novel-systems/shared/schemas/UserDetailsConfig')
const EventTagSchema = require('@novel-systems/shared/schemas/EventTag')
const RegistrationConfigSchema = require('@novel-systems/shared/schemas/RegistrationConfig')
const AddressSchema = require('@novel-systems/shared/schemas/Address')
const WebhookSchema = require('@novel-systems/shared/schemas/Webhook')
const EventThemeSchema = require('@novel-systems/shared/schemas/EventTheme')
const EventTimelineSchema = require('@novel-systems/shared/schemas/EventTimeline')
const MeetingRoomSchema = require('@novel-systems/shared/schemas/MeetingRoom')
const EventPageScriptSchema = require('@novel-systems/shared/schemas/EventPageScript')
const ProjectDefaultFields = require('@novel-systems/shared/constants/project-default-fields')
const SubmissionDefaultFieldsSchema = require('@novel-systems/shared/schemas/SubmissionDefaultFields')
const SubmissionDefaultFields = require('@novel-systems/shared/constants/submission-default-fields')
const ScoreCriteriaSettingsSchema = require('@novel-systems/shared/schemas/ScoreCriteriaSettings')
const uploadHelper = require('../upload/helper')
const updateAllowedPlugin = require('../../common/plugins/updateAllowed')
const allowPublishPlugin = require('../../common/plugins/allowPublish')
const EventSettings = require('./settings')

const EventSchema = new mongoose.Schema({
    /** Event info */
    name: {
        type: String,
        required: true,
        requiredForPublish: true,
        maxLength: 100,
        trim: true,
    },
    description: {
        type: String,
        requiredForPublish: true,
        maxLength: 5000,
        trim: true,
    },
    /** Times */
    timezone: {
        type: String,
        requiredForPublish: true,
    },
    registrationStartTime: {
        type: Date,
        requiredForPublish: true,
    },
    registrationEndTime: {
        type: Date,
        requiredForPublish: true,
    },
    startTime: {
        type: Date,
        requiredForPublish: true,
    },
    endTime: {
        type: Date,
        requiredForPublish: true,
    },
    submissionsStartTime: {
        type: Date,
        requiredForPublish: true,
    },
    submissionsEndTime: {
        type: Date,
        requiredForPublish: true,
    },
    reviewingStartTime: {
        type: Date,
        requiredForPublish: true,
    },
    reviewingEndTime: {
        type: Date,
        requiredForPublish: true,
    },
    /** Make this a date type also */
    finalsActive: {
        type: Boolean,
        default: false,
    },
    /** Event customisation */
    coverImage: CloudinaryImageSchema.mongoose,
    logo: CloudinaryImageSchema.mongoose,
    certificate: Certificate.mongoose,
    // map: mongoFile.mongoose,
    /** Event configuration */
    eventType: {
        type: String,
        enum: Object.keys(EventTypes),
        required: true,
        default: EventTypes.online.id,
    },
    eventLocation: {
        type: AddressSchema.mongoose,
        required: [
            function () {
                return (
                    this.eventType === EventTypes.physical.id ||
                    this.eventType === EventTypes.hybrid.id
                )
            },
            `is required for physical or hydrid events`,
        ],
    },
    tracksEnabled: {
        type: Boolean,
        default: EventSettings.tracksEnabled,
    },
    tracks: {
        type: [TrackSchema.mongoose],
        default: [],
        validate: [
            function (val) {
                if (EventSettings.tracksEnabled) {
                    return val.length > 0
                }
                return true
            },
            'must have at least one item if tracks are enabled',
        ],
        required: [
            function () {
                return EventSettings.tracksEnabled
            },
            'is required if tracks are enabled',
        ],
    },
    challengesEnabled: {
        type: Boolean,
        default: EventSettings.challengesEnabled,
    },
    challenges: {
        type: [ChallengeSchema.mongoose],
        default: [],
        validate: [
            function (val) {
                if (EventSettings.challengesEnabled) {
                    return val.length > 0
                }
                return true
            },
            'must have at least one item if challenges are enabled',
        ],
    },
    hackerpacksEnabled: {
        type: Boolean,
        default: EventSettings.hackerpacksEnabled,
    },
    hackerpacks: {
        type: [HackerpackSchema.mongoose],
        default: [],
    },
    allowProjectSubmissionsPerChallenge: {
        type: Boolean,
        default: false,
    },
    allowVoteOnOwnProject: {
        type: Boolean,
        default: false,
    },
    // Mongoose will cast the empty object to match `TravelGrantConfigSchema`, so it will set defaults
    travelGrantConfig: {
        type: TravelGrantConfigSchema.mongoose,
        default: () => ({}),
    },
    reviewMethod: {
        type: String,
        required: true,
        default: ReviewingMethods.gavelPeerReview.id,
        enum: Object.keys(ReviewingMethods),
    },
    overallReviewMethod: {
        type: String,
        enum: Object.keys(OverallReviewingMethods),
        required: [
            function () {
                return EventSettings.tracksEnabled
            },
            'is required if tracks are enabled',
        ],
    },
    userDetailsConfig: {
        /** Deprecated, removed in migration 00-registration-questions */
        type: UserDetailsConfigSchema.mongoose,
    },
    registrationConfig: {
        /** Introduced in favor of userDetailsConfig in 00-registration-questions */
        // Mongoose will cast the empty object to match `RegistrationConfigSchema`, so it will set defaults
        type: RegistrationConfigSchema.mongoose,
        default: () => ({ description: '' }),
    },
    customQuestions: {
        type: [RegistrationSectionSchema.mongoose],
    },
    tags: {
        type: [EventTagSchema.mongoose],
        default: [],
    },
    webhooks: {
        type: [WebhookSchema.mongoose],
        default: [],
    },
    eventTimeline: {
        type: EventTimelineSchema.mongoose,
        default: {
            items: [
                {
                    title: 'Registration period',
                    startTime: new Date(new Date().getTime()),
                },
                {
                    title: 'Submission period',
                    startTime: new Date(new Date().getTime() + 1),
                },
                {
                    title: 'Review period',
                    startTime: new Date(new Date().getTime() + 2),
                },
                {
                    title: 'Event starts',
                    startTime: new Date(new Date().getTime() + 3),
                },
                {
                    title: 'Event ends',
                    startTime: new Date(new Date().getTime() + 4),
                },
            ],
        },
    },
    metaDescription: {
        type: String,
        default: '',
    },
    /** System metadata */
    published: {
        type: Boolean,
        default: false,
        required: true,
    },
    galleryOpen: {
        type: Boolean,
        default: false,
        required: true,
        validate: [
            function (val) {
                if (val === true) {
                    return this.published
                }
                return true
            },
            `must be published before the project gallery can be opened`,
        ],
    },
    owner: {
        type: String,
        required: true,
    },
    organisers: {
        type: [String],
        default: [],
    },
    recruiters: {
        type: [EventRecruitersSchema.mongoose],
        default: [],
    },
    organizations: {
        type: [String],
        default: [],
    },
    slug: {
        type: String,
        slug: 'name',
        unique: true,
        slugPaddingSize: 2,
    },
    winners: {
        type: mongoose.Mixed,
        default: {},
    },
    finalists: {
        type: [String],
        default: [],
    },
    challenge_instructions: {
        type: String,
    },
    faq: {
        type: String,
    },
    demoInstructions: {
        type: String,
    },
    demoLabel: {
        type: String,
        default: 'Demo URL',
    },
    demoHint: {
        type: String,
        default:
            'Add the link of the working version of your project. Depending on the event, this could be a link to an API, a link to file or a presentation. Make sure the link is accessible for humans, as well as machines',
    },
    demoPlaceholder: {
        type: String,
        default: 'https://...',
    },
    eventPrivacy: {
        type: String,
    },
    eventTerms: {
        type: String,
    },
    eventNewsletter: {
        type: String,
    },
    emailConfig: {
        senderEmail: {
            type: String,
            default: 'noreply@novel.systems',
            trim: true,
            validate: {
                validator(v) {
                    return /\S+@\S+\.\S+/.test(v)
                },
                message: props =>
                    `${props.value} is not a valid email address!`,
            },
        },
        senderName: {
            type: String,
            default: 'Placeholder-1 team',
            trim: true,
            maxLength: 100,
        },
        acceptanceEmail: {
            title: {
                type: String,
                default: '',
                trim: true,
                maxLength: 100,
            },
            subtitle: {
                type: String,
                default: '',
                trim: true,
                maxLength: 100,
            },
            body: {
                type: String,
                default: '',
                trim: true,
                maxLength: 5000,
            },
        },
        rejectionEmail: {
            title: {
                type: String,
                default: '',
                trim: true,
                maxLength: 100,
            },
            subtitle: {
                type: String,
                default: '',
                trim: true,
                maxLength: 100,
            },
            body: {
                type: String,
                default: '',
                trim: true,
                maxLength: 5000,
            },
        },
        registrationEmail: {
            title: {
                type: String,
                default: '',
                trim: true,
                maxLength: 100,
            },
            subtitle: {
                type: String,
                default: '',
                trim: true,
                maxLength: 100,
            },
            body: {
                type: String,
                default: '',
                trim: true,
                maxLength: 5000,
            },
        },
    },
    frontPagePriority: {
        type: Number,
        default: 0,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    theme: { type: EventThemeSchema.mongoose, default: {} },
    pageScripts: {
        type: [EventPageScriptSchema.mongoose],
        default: [],
    },
    meetingsEnabled: {
        type: Boolean,
        default: EventSettings.meetingsEnabled,
    },
    meetingRooms: {
        type: [MeetingRoomSchema.mongoose],
        default: [],
    },
    submissionFormQuestions: {
        type: [RegistrationSectionSchema.mongoose],
    },
    submissionFormEnabledFields: {
        type: [String],
        default: ProjectDefaultFields,
    },
    submissionFormDefaultFields: {
        type: SubmissionDefaultFieldsSchema.mongoose,
        default: SubmissionDefaultFields,
    },
    // New fields for score criteria and score settings
    scoreCriteriaSettings: {
        type: ScoreCriteriaSettingsSchema.mongoose,
    },
    experimental: {
        type: Boolean,
        default: false,
    },
})

EventSchema.index(
    {
        slug: 1,
    },
    {
        unique: true,
    },
)

EventSchema.plugin(mongooseSlugPlugin, {
    tmpl: '<%=name%>',
    alwaysUpdateSlug: false,
    slugOptions: {
        custom: {
            "'": '',
        },
    },
})

EventSchema.plugin(allowPublishPlugin, {
    defaultPublished: false,
})

EventSchema.plugin(updateAllowedPlugin, {
    blacklisted: ['__v', '_id', 'owner', 'createdAt', 'updatedAt', 'slug'],
})

EventSchema.set('timestamps', true)

EventSchema.post('remove', async doc => {
    await uploadHelper.removeEventImages(doc.slug)
})

const Event = mongoose.model('Event', EventSchema)

module.exports = Event

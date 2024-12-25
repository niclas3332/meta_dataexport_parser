// folderConfigs.js
import { faker } from '@faker-js/faker';

export const folderConfigs = {
    baseLabels: [

        {
            label: "User ID",
            getValue: () => faker.string.uuid(),
            description: "Unique identifier for the user"
        },
        {
            label: "Session ID",
            getValue: () => faker.string.alphanumeric(16),
            description: "Unique session identifier"
        },
        {
            label: "Platform",
            getValue: () => faker.helpers.arrayElement(['iOS', 'Android', 'Web', 'Desktop']),
            description: "Platform where the event occurred"
        }
    ],

    'Browser interactions': [
        {
            label: "App name",
            getValue: () => faker.helpers.arrayElement(['FBWeb', 'FBLite', 'Instagram', 'Messenger', 'WhatsApp', 'Threads']),
            description: "The Meta app related to this request"
        },
        {
            label: "Browser",
            getValue: () => faker.internet.userAgent(),
            description: "Browser information"
        },
        {
            label: "Page URL",
            getValue: () => faker.internet.url(),
            description: "URL of the page visited"
        },
        {
            label: "Interaction type",
            getValue: () => faker.helpers.arrayElement(['click', 'scroll', 'hover', 'input', 'submit', 'keypress', 'focus', 'blur']),
            description: "Type of interaction with the browser"
        },
        {
            label: "Element ID",
            getValue: () => faker.helpers.arrayElement(['nav-menu', 'search-bar', 'profile-btn', 'post-form', 'comment-section']),
            description: "ID of the interacted element"
        },
        {
            label: "Screen resolution",
            getValue: () => faker.helpers.arrayElement(['1920x1080', '2560x1440', '1366x768', '3840x2160']),
            description: "Screen resolution during interaction"
        }
    ],

    'Account activity': [
        {
            label: "Activity type",
            getValue: () => faker.helpers.arrayElement(['Login', 'Logout', 'Password change', 'Profile update', 'Email change', 'Phone change', '2FA setup', 'Privacy settings update']),
            description: "Type of account activity"
        },
        {
            label: "IP Address",
            getValue: () => [Math.floor(Math.random() * 256 + 1), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 45 + 256)].join('.'),
            description: "IP address of the activity"
        },
        {
            label: "Success status",
            getValue: () => faker.helpers.arrayElement(['success', 'failed', 'pending', 'canceled']),
            description: "Whether the activity was successful"
        },
        {
            label: "Device ID",
            getValue: () => faker.string.uuid(),
            description: "Unique identifier for the device"
        },
        {
            label: "Location",
            getValue: () => `${faker.location.city()}, ${faker.location.country()}`,
            description: "Location of the activity"
        },
        {
            label: "User agent",
            getValue: () => faker.internet.userAgent(),
            description: "User agent string of the device"
        }
    ],

    'Security events': [
        {
            label: "Event type",
            getValue: () => faker.helpers.arrayElement(['2FA enabled', 'Login attempt', 'Device confirmation', 'Password reset', 'Security alert', 'Access token update', 'IP block', 'Account lockout']),
            description: "Type of security event"
        },
        {
            label: "Location",
            getValue: () => `${faker.location.city()}, ${faker.location.country()}`,
            description: "Location of the event"
        },
        {
            label: "Risk level",
            getValue: () => faker.helpers.arrayElement(['low', 'medium', 'high', 'critical']),
            description: "Risk level of the security event"
        },
        {
            label: "Action taken",
            getValue: () => faker.helpers.arrayElement(['blocked', 'allowed', 'flagged', 'reviewed', 'escalated', 'ignored']),
            description: "Action taken for the security event"
        },
        {
            label: "Device fingerprint",
            getValue: () => faker.string.alphanumeric(32),
            description: "Unique device fingerprint"
        },
        {
            label: "Authentication method",
            getValue: () => faker.helpers.arrayElement(['password', 'fingerprint', 'face_id', '2fa_sms', '2fa_authenticator']),
            description: "Method used for authentication"
        }
    ],

    'Content interactions': [
        {
            label: "Content type",
            getValue: () => faker.helpers.arrayElement(['post', 'story', 'reel', 'comment', 'message', 'live_stream', 'poll', 'quiz']),
            description: "Type of content"
        },
        {
            label: "Interaction type",
            getValue: () => faker.helpers.arrayElement(['like', 'share', 'comment', 'save', 'report', 'hide', 'follow', 'block']),
            description: "Type of interaction"
        },
        {
            label: "Content ID",
            getValue: () => faker.string.uuid(),
            description: "Unique content identifier"
        },
        {
            label: "Duration",
            getValue: () => faker.number.int({ min: 1, max: 3600 }),
            description: "Duration of interaction in seconds"
        },
        {
            label: "Content creator ID",
            getValue: () => faker.string.uuid(),
            description: "ID of the content creator"
        },
        {
            label: "Visibility",
            getValue: () => faker.helpers.arrayElement(['public', 'friends', 'private', 'custom']),
            description: "Content visibility setting"
        }
    ],

    'Ad interactions': [
        {
            label: "Ad ID",
            getValue: () => faker.string.uuid(),
            description: "Unique identifier for the advertisement"
        },
        {
            label: "Campaign ID",
            getValue: () => faker.string.uuid(),
            description: "ID of the ad campaign"
        },
        {
            label: "Interaction type",
            getValue: () => faker.helpers.arrayElement(['impression', 'click', 'conversion', 'skip', 'report']),
            description: "Type of interaction with the ad"
        },
        {
            label: "Ad placement",
            getValue: () => faker.helpers.arrayElement(['feed', 'story', 'sidebar', 'messenger', 'marketplace']),
            description: "Where the ad was shown"
        },
        {
            label: "Duration viewed",
            getValue: () => faker.number.int({ min: 0, max: 60 }),
            description: "How long the ad was viewed in seconds"
        },
        {
            label: "Ad format",
            getValue: () => faker.helpers.arrayElement(['image', 'video', 'carousel', 'collection', 'story']),
            description: "Format of the advertisement"
        }
    ],

    'Payment history': [
        {
            label: "Transaction ID",
            getValue: () => faker.string.alphanumeric(24),
            description: "Unique transaction identifier"
        },
        {
            label: "Amount",
            getValue: () => faker.finance.amount(),
            description: "Transaction amount"
        },
        {
            label: "Currency",
            getValue: () => faker.finance.currencyCode(),
            description: "Transaction currency"
        },
        {
            label: "Status",
            getValue: () => faker.helpers.arrayElement(['completed', 'pending', 'failed', 'refunded', 'disputed', 'cancelled']),
            description: "Transaction status"
        },
        {
            label: "Payment method",
            getValue: () => faker.helpers.arrayElement(['credit_card', 'paypal', 'bank_transfer', 'crypto', 'gift_card']),
            description: "Method of payment"
        },
        {
            label: "Billing country",
            getValue: () => faker.location.country(),
            description: "Country where billing address is located"
        }
    ],

    'Device history': [
        {
            label: "Device type",
            getValue: () => faker.helpers.arrayElement(['smartphone', 'tablet', 'laptop', 'desktop', 'smart_tv', 'console']),
            description: "Type of device"
        },
        {
            label: "OS",
            getValue: () => faker.helpers.arrayElement(['iOS 16.0', 'Android 13', 'Windows 11', 'macOS 13', 'Linux']),
            description: "Operating system"
        },
        {
            label: "App version",
            getValue: () => faker.system.semver(),
            description: "Version of the app"
        },
        {
            label: "Network type",
            getValue: () => faker.helpers.arrayElement(['wifi', '5G', '4G', '3G', 'ethernet']),
            description: "Type of network connection"
        },
        {
            label: "Battery level",
            getValue: () => faker.number.int({ min: 0, max: 100 }),
            description: "Device battery level percentage"
        },
        {
            label: "Storage available",
            getValue: () => `${faker.number.int({ min: 1, max: 1000 })}GB`,
            description: "Available storage on device"
        }
    ],

    'Search history': [
        {
            label: "Search query",
            getValue: () => faker.lorem.words({ min: 1, max: 5 }),
            description: "The search term used"
        },
        {
            label: "Search type",
            getValue: () => faker.helpers.arrayElement(['people', 'posts', 'photos', 'videos', 'places', 'groups']),
            description: "Type of search performed"
        },
        {
            label: "Results count",
            getValue: () => faker.number.int({ min: 0, max: 1000 }),
            description: "Number of search results"
        },
        {
            label: "Filters applied",
            getValue: () => faker.helpers.arrayElements(['date', 'location', 'friend', 'public'], faker.number.int({ min: 0, max: 3 })).join(','),
            description: "Search filters that were applied"
        },
        {
            label: "Result clicked",
            getValue: () => faker.datatype.boolean().toString(),
            description: "Whether a search result was clicked"
        },
        {
            label: "Search duration",
            getValue: () => faker.number.int({ min: 1, max: 300 }),
            description: "Time spent on search in seconds"
        }
    ],

    'Privacy settings': [
        {
            label: "Setting type",
            getValue: () => faker.helpers.arrayElement(['profile_visibility', 'friend_requests', 'post_visibility', 'tag_settings', 'blocking']),
            description: "Type of privacy setting"
        },
        {
            label: "Old value",
            getValue: () => faker.helpers.arrayElement(['public', 'friends', 'private', 'custom']),
            description: "Previous privacy setting"
        },
        {
            label: "New value",
            getValue: () => faker.helpers.arrayElement(['public', 'friends', 'private', 'custom']),
            description: "Updated privacy setting"
        },
        {
            label: "Changed by",
            getValue: () => faker.helpers.arrayElement(['user', 'admin', 'system', 'support']),
            description: "Who changed the setting"
        },
        {
            label: "Change reason",
            getValue: () => faker.helpers.arrayElement(['user_request', 'security_recommendation', 'policy_update', 'system_upgrade']),
            description: "Reason for the change"
        },
        {
            label: "Affects features",
            getValue: () => faker.helpers.arrayElements(['messaging', 'posts', 'friend_requests', 'search'], faker.number.int({ min: 1, max: 3 })).join(','),
            description: "Features affected by this setting"
        }
    ]
};
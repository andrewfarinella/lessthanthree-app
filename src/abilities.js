import { AbilityBuilder } from '@casl/ability'
const subjectName = (item) => {
  if (!item || typeof item === 'string') {
    return item
  }

  return item.__typename
}

const guestAbilities = AbilityBuilder.define({ subjectName }, can => {
  can('read', ['Game', 'Rating', 'Vote'])
})

const abilities = (user) => {
  if (user.role && user.role === 'admin') {
    return [
      {
        action: ['manage'],
        subject: 'all'
      }
    ]
  } else {
    return [
      {
        action: ['read'],
        subject: ['Game', 'Rating', 'Vote']
      },
      {
        action: ['create', 'delete'],
        subject: ['Vote'],
        conditions: {
          'user._id': user._id
        }
      },
      {
        action: ['create'],
        subject: ['Rating']
      }
    ]
  }
}

export {
  guestAbilities,
  abilities
}

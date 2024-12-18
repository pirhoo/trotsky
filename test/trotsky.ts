
import t from 'tap'
import { AtpAgent } from '@atproto/api'

import { Trotsky } from '../lib/trotsky.ts'

t.test('trotsky', t => {
  const agent = new AtpAgent({ service: 'https://bsky.social' })

  t.ok(Trotsky.init(agent) instanceof Trotsky)
  t.end()
})
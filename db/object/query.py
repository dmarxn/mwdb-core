from collections import defaultdict

import db.query as query
from db.object.models import *


def type_error(str):
    raise TypeError(str)


def ssdeep_sim(a, b):
    hash, sim = b.split(',')
    sim = int(sim)
    return func.fuzzy_hash_compare(a, hash) > sim


class opdict(defaultdict):
    def __init__(self, vals):
        def_f = lambda a, b: type_error('you cant do it')
        super(opdict, self).__init__(lambda: def_f)
        for k, v in vals:
            self[k] = v


class base_ops(opdict):
    def __init__(self, v):
        super(base_ops, self).__init__([('=', lambda a, b: a == b)] + v)

likable_ops = base_ops([('like', lambda a, b: a.like(b))])
tag_ops = opdict([('=', lambda a, b: a.any(Tag.tag == b.lower()))])
ssdeep_ops = base_ops([('~', ssdeep_sim)])
# No sauce anymore?
# source_ops = base_ops([('like', lambda a, b: a.any(Source.source.like(b)))])


class MalwareQuery(query.Query):
    def __init__(self, q):
        #ctx = {'tag': tag_ops, 'source': source_ops, 'ssdeep': ssdeep_ops,
        #       'file_name': likable_ops, 'file_type': likable_ops, 'comment': likable_ops,
        #       }
        ctx = {'tag': tag_ops, 'ssdeep': ssdeep_ops,
               'file_name': likable_ops, 'file_type': likable_ops, 'comment': likable_ops,
               }
        super(MalwareQuery, self).__init__(q, ctx, Object)

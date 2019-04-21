from time import time
from vector_model_LSA import *
import numpy as np
import os
import json
import tornado.ioloop
import tornado.web

class RankingHandler(tornado.web.RequestHandler):
    def get(self):
        start = time()
        q = self.get_argument('q')
        res = ranking(q, docs, U, invS)
        self.write(json.dumps({'results':res, 'time': np.round(time()-start,3)}))

class MyFileHandler(tornado.web.StaticFileHandler):
    def initialize(self, path):
        self.dirname, self.filename = os.path.split(path)
        super(MyFileHandler, self).initialize(self.dirname)

    def get(self, path=None, include_body=True):
        # ignore path
        super(MyFileHandler, self).get(self.filename, include_body)

if __name__ == "__main__":
    
    app = tornado.web.Application([
        (r"/ranking", RankingHandler),      
        (r"/(?!static|font).*", MyFileHandler, {'path': './public/index.html'}),
        (r'/(.*)', tornado.web.StaticFileHandler, {'path': 'public'}),
    ])
    app.listen(int(os.environ.get("PORT", 5000)))
    tornado.ioloop.IOLoop.current().start()


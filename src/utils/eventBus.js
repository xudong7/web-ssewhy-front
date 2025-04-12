// const eventNames = ['API:UN_AUTH', 'API:NOT_FOUND']

class EventBus {
	listeners = {
		'API:UN_AUTH': new Set(),
		'API:NOT_FOUND': new Set(),
	};

    /**
     * 
     * @param {'API:UN_AUTH'|'API:NOT_FOUND'} eventName 
     * @param {*} listener 
     */
	on(eventName, listener) {
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = new Set();
		}
		this.listeners[eventName].add(listener);
	}

    /**
     * 
     * @param {'API:UN_AUTH'|'API:NOT_FOUND'} eventName 
     * @param  {...any} args 
     */
	emit(eventName, ...args) {
		this.listeners[eventName].forEach((listener) => listener(...args));
	}
}

export default new EventBus();

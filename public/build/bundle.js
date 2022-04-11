
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.6' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Header.svelte generated by Svelte v3.46.6 */

    const file$7 = "src/Header.svelte";

    function create_fragment$8(ctx) {
    	let nav;
    	let ul;
    	let li0;
    	let a0;
    	let t1;
    	let li1;
    	let a1;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Portfolio";
    			attr_dev(a0, "href", "#home");
    			attr_dev(a0, "class", "nav-link svelte-1ttexmi");
    			add_location(a0, file$7, 2, 25, 67);
    			attr_dev(li0, "class", "nav-item svelte-1ttexmi");
    			add_location(li0, file$7, 2, 4, 46);
    			attr_dev(a1, "href", "#portfolio");
    			attr_dev(a1, "class", "nav-link svelte-1ttexmi");
    			add_location(a1, file$7, 3, 25, 139);
    			attr_dev(li1, "class", "nav-item svelte-1ttexmi");
    			add_location(li1, file$7, 3, 4, 118);
    			attr_dev(ul, "class", "nav-list svelte-1ttexmi");
    			add_location(ul, file$7, 1, 2, 20);
    			attr_dev(nav, "class", "nav svelte-1ttexmi");
    			add_location(nav, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/Overview.svelte generated by Svelte v3.46.6 */

    const file$6 = "src/Overview.svelte";

    function create_fragment$7(ctx) {
    	let div2;
    	let div1;
    	let h1;
    	let span0;
    	let t1;
    	let span1;
    	let t3;
    	let div0;
    	let h2;
    	let t5;
    	let nav;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t6;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let a2;
    	let img2;
    	let img2_src_value;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			span0 = element("span");
    			span0.textContent = "Tamara";
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = "Snyder";
    			t3 = space();
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "iOS Developer";
    			t5 = space();
    			nav = element("nav");
    			a0 = element("a");
    			img0 = element("img");
    			t6 = space();
    			a1 = element("a");
    			img1 = element("img");
    			t7 = space();
    			a2 = element("a");
    			img2 = element("img");
    			attr_dev(span0, "class", "wpr");
    			add_location(span0, file$6, 10, 6, 296);
    			attr_dev(span1, "class", "wpr");
    			add_location(span1, file$6, 11, 6, 334);
    			attr_dev(h1, "class", "svelte-mpee3z");
    			add_location(h1, file$6, 9, 4, 285);
    			attr_dev(h2, "class", "svelte-mpee3z");
    			add_location(h2, file$6, 14, 6, 417);
    			attr_dev(div0, "class", "typing-container svelte-mpee3z");
    			add_location(div0, file$6, 13, 4, 380);
    			attr_dev(img0, "class", "media-icon svelte-mpee3z");
    			if (!src_url_equal(img0.src, img0_src_value = /*linkedinIcon*/ ctx[0])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "LinkedIn profile");
    			add_location(img0, file$6, 19, 8, 556);
    			attr_dev(a0, "href", "https://www.linkedin.com/in/tamara-snyder-a6a1391b7/");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$6, 18, 6, 468);
    			attr_dev(img1, "class", "media-icon svelte-mpee3z");
    			if (!src_url_equal(img1.src, img1_src_value = /*githubIcon*/ ctx[2])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Github profile");
    			add_location(img1, file$6, 22, 8, 709);
    			attr_dev(a1, "href", "https://github.com/tamara-snyder");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$6, 21, 6, 641);
    			attr_dev(img2, "class", "media-icon svelte-mpee3z");
    			if (!src_url_equal(img2.src, img2_src_value = /*twitterIcon*/ ctx[1])) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Twitter profile");
    			add_location(img2, file$6, 25, 8, 856);
    			attr_dev(a2, "href", "https://twitter.com/dev_tamara");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$6, 24, 6, 790);
    			attr_dev(nav, "class", "svelte-mpee3z");
    			add_location(nav, file$6, 17, 4, 456);
    			attr_dev(div1, "class", "content svelte-mpee3z");
    			add_location(div1, file$6, 8, 2, 259);
    			attr_dev(div2, "class", "background svelte-mpee3z");
    			add_location(div2, file$6, 7, 0, 232);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(h1, span0);
    			append_dev(h1, t1);
    			append_dev(h1, span1);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(div1, t5);
    			append_dev(div1, nav);
    			append_dev(nav, a0);
    			append_dev(a0, img0);
    			append_dev(nav, t6);
    			append_dev(nav, a1);
    			append_dev(a1, img1);
    			append_dev(nav, t7);
    			append_dev(nav, a2);
    			append_dev(a2, img2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Overview', slots, []);
    	let linkedinIcon = 'images/linkedin_icon.png';
    	let twitterIcon = 'images/twitter_icon.png';
    	let githubIcon = 'images/github_icon.png';
    	let content = ["iOS Developer", "Web developer", "Software Enthusiast"];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Overview> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		linkedinIcon,
    		twitterIcon,
    		githubIcon,
    		content
    	});

    	$$self.$inject_state = $$props => {
    		if ('linkedinIcon' in $$props) $$invalidate(0, linkedinIcon = $$props.linkedinIcon);
    		if ('twitterIcon' in $$props) $$invalidate(1, twitterIcon = $$props.twitterIcon);
    		if ('githubIcon' in $$props) $$invalidate(2, githubIcon = $$props.githubIcon);
    		if ('content' in $$props) content = $$props.content;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [linkedinIcon, twitterIcon, githubIcon];
    }

    class Overview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Overview",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/MediaQuery.svelte generated by Svelte v3.46.6 */
    const get_default_slot_changes = dirty => ({ matches: dirty & /*matches*/ 1 });
    const get_default_slot_context = ctx => ({ matches: /*matches*/ ctx[0] });

    function create_fragment$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, matches*/ 9)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MediaQuery', slots, ['default']);
    	let { query } = $$props;
    	let mql;
    	let mqlListener;
    	let wasMounted = false;
    	let matches = false;

    	onMount(() => {
    		$$invalidate(2, wasMounted = true);

    		return () => {
    			removeActiveListener();
    		};
    	});

    	function addNewListener(query) {
    		mql = window.matchMedia(query);
    		mqlListener = v => $$invalidate(0, matches = v.matches);
    		mql.addListener(mqlListener);
    		$$invalidate(0, matches = mql.matches);
    	}

    	function removeActiveListener() {
    		if (mql && mqlListener) {
    			mql.removeListener(mqlListener);
    		}
    	}

    	const writable_props = ['query'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MediaQuery> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('query' in $$props) $$invalidate(1, query = $$props.query);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		query,
    		mql,
    		mqlListener,
    		wasMounted,
    		matches,
    		addNewListener,
    		removeActiveListener
    	});

    	$$self.$inject_state = $$props => {
    		if ('query' in $$props) $$invalidate(1, query = $$props.query);
    		if ('mql' in $$props) mql = $$props.mql;
    		if ('mqlListener' in $$props) mqlListener = $$props.mqlListener;
    		if ('wasMounted' in $$props) $$invalidate(2, wasMounted = $$props.wasMounted);
    		if ('matches' in $$props) $$invalidate(0, matches = $$props.matches);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*wasMounted, query*/ 6) {
    			{
    				if (wasMounted) {
    					removeActiveListener();
    					addNewListener(query);
    				}
    			}
    		}
    	};

    	return [matches, query, wasMounted, $$scope, slots];
    }

    class MediaQuery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { query: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MediaQuery",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*query*/ ctx[1] === undefined && !('query' in props)) {
    			console.warn("<MediaQuery> was created without expected prop 'query'");
    		}
    	}

    	get query() {
    		throw new Error("<MediaQuery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set query(value) {
    		throw new Error("<MediaQuery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/BioText.svelte generated by Svelte v3.46.6 */

    const file$5 = "src/BioText.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let p0;
    	let t2;
    	let p1;
    	let t3;
    	let a0;
    	let t5;
    	let t6;
    	let p2;
    	let t7;
    	let a1;
    	let t9;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "Hi, I'm Tamara! I am a budding iOS/web developer with a passion for learning new things and building beautiful and functional apps.";
    			t2 = space();
    			p1 = element("p");
    			t3 = text("I come from a musical background as a classical bassoonist, and I would like to think that I can even ");
    			a0 = element("a");
    			a0.textContent = "play two instruments at the same time";
    			t5 = text(".");
    			t6 = space();
    			p2 = element("p");
    			t7 = text("In my spare time, you can find me volunteering as a full-stack developer for the ");
    			a1 = element("a");
    			a1.textContent = "Hack for LA";
    			t9 = text(" website or riding my gravel bike everywhere I possibly can.");
    			attr_dev(img, "id", "avatar");
    			if (!src_url_equal(img.src, img_src_value = "images/snyder_pressphoto.JPG")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1xj6f2h");
    			add_location(img, file$5, 1, 2, 27);
    			attr_dev(p0, "class", "about svelte-1xj6f2h");
    			add_location(p0, file$5, 2, 2, 89);
    			attr_dev(a0, "href", "https://www.youtube.com/watch?v=ZC7UmLJI9Uk");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$5, 6, 106, 362);
    			attr_dev(p1, "class", "svelte-1xj6f2h");
    			add_location(p1, file$5, 5, 2, 252);
    			attr_dev(a1, "href", "https://www.hackforla.org/");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$5, 9, 85, 573);
    			attr_dev(p2, "class", "svelte-1xj6f2h");
    			add_location(p2, file$5, 8, 2, 484);
    			attr_dev(div, "class", "background svelte-1xj6f2h");
    			add_location(div, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, p0);
    			append_dev(div, t2);
    			append_dev(div, p1);
    			append_dev(p1, t3);
    			append_dev(p1, a0);
    			append_dev(p1, t5);
    			append_dev(div, t6);
    			append_dev(div, p2);
    			append_dev(p2, t7);
    			append_dev(p2, a1);
    			append_dev(p2, t9);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BioText', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BioText> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class BioText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BioText",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/About.svelte generated by Svelte v3.46.6 */
    const file$4 = "src/About.svelte";

    // (7:2) {#if matches}
    function create_if_block_2(ctx) {
    	let div;
    	let biotext;
    	let current;
    	biotext = new BioText({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(biotext.$$.fragment);
    			attr_dev(div, "class", "mobile svelte-savbow");
    			add_location(div, file$4, 7, 2, 178);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(biotext, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(biotext.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(biotext.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(biotext);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(7:2) {#if matches}",
    		ctx
    	});

    	return block;
    }

    // (6:0) <MediaQuery query="(max-width: 480px)" let:matches>
    function create_default_slot_2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*matches*/ ctx[0] && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*matches*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*matches*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(6:0) <MediaQuery query=\\\"(max-width: 480px)\\\" let:matches>",
    		ctx
    	});

    	return block;
    }

    // (15:2) {#if matches}
    function create_if_block_1(ctx) {
    	let div;
    	let biotext;
    	let current;
    	biotext = new BioText({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(biotext.$$.fragment);
    			attr_dev(div, "class", "tablet svelte-savbow");
    			add_location(div, file$4, 15, 2, 340);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(biotext, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(biotext.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(biotext.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(biotext);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(15:2) {#if matches}",
    		ctx
    	});

    	return block;
    }

    // (14:0) <MediaQuery query="(min-width: 481px) and (max-width: 1280px)" let:matches>
    function create_default_slot_1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*matches*/ ctx[0] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*matches*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*matches*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(14:0) <MediaQuery query=\\\"(min-width: 481px) and (max-width: 1280px)\\\" let:matches>",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#if matches}
    function create_if_block(ctx) {
    	let div;
    	let biotext;
    	let current;
    	biotext = new BioText({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(biotext.$$.fragment);
    			attr_dev(div, "class", "desktop svelte-savbow");
    			add_location(div, file$4, 23, 2, 479);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(biotext, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(biotext.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(biotext.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(biotext);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(23:2) {#if matches}",
    		ctx
    	});

    	return block;
    }

    // (22:0) <MediaQuery query="(min-width: 1281px)" let:matches>
    function create_default_slot(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*matches*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*matches*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*matches*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(22:0) <MediaQuery query=\\\"(min-width: 1281px)\\\" let:matches>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let mediaquery0;
    	let t0;
    	let mediaquery1;
    	let t1;
    	let mediaquery2;
    	let current;

    	mediaquery0 = new MediaQuery({
    			props: {
    				query: "(max-width: 480px)",
    				$$slots: {
    					default: [
    						create_default_slot_2,
    						({ matches }) => ({ 0: matches }),
    						({ matches }) => matches ? 1 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	mediaquery1 = new MediaQuery({
    			props: {
    				query: "(min-width: 481px) and (max-width: 1280px)",
    				$$slots: {
    					default: [
    						create_default_slot_1,
    						({ matches }) => ({ 0: matches }),
    						({ matches }) => matches ? 1 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	mediaquery2 = new MediaQuery({
    			props: {
    				query: "(min-width: 1281px)",
    				$$slots: {
    					default: [
    						create_default_slot,
    						({ matches }) => ({ 0: matches }),
    						({ matches }) => matches ? 1 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mediaquery0.$$.fragment);
    			t0 = space();
    			create_component(mediaquery1.$$.fragment);
    			t1 = space();
    			create_component(mediaquery2.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(mediaquery0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(mediaquery1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(mediaquery2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const mediaquery0_changes = {};

    			if (dirty & /*$$scope, matches*/ 3) {
    				mediaquery0_changes.$$scope = { dirty, ctx };
    			}

    			mediaquery0.$set(mediaquery0_changes);
    			const mediaquery1_changes = {};

    			if (dirty & /*$$scope, matches*/ 3) {
    				mediaquery1_changes.$$scope = { dirty, ctx };
    			}

    			mediaquery1.$set(mediaquery1_changes);
    			const mediaquery2_changes = {};

    			if (dirty & /*$$scope, matches*/ 3) {
    				mediaquery2_changes.$$scope = { dirty, ctx };
    			}

    			mediaquery2.$set(mediaquery2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mediaquery0.$$.fragment, local);
    			transition_in(mediaquery1.$$.fragment, local);
    			transition_in(mediaquery2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mediaquery0.$$.fragment, local);
    			transition_out(mediaquery1.$$.fragment, local);
    			transition_out(mediaquery2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mediaquery0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(mediaquery1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(mediaquery2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ MediaQuery, BioText });
    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Contact.svelte generated by Svelte v3.46.6 */

    const file$3 = "src/Contact.svelte";

    function create_fragment$3(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let footer;
    	let div1;
    	let a0;
    	let t2;
    	let a1;
    	let t4;
    	let a2;
    	let t6;
    	let p;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			footer = element("footer");
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "LinkedIn";
    			t2 = space();
    			a1 = element("a");
    			a1.textContent = "Github";
    			t4 = space();
    			a2 = element("a");
    			a2.textContent = "Twitter";
    			t6 = space();
    			p = element("p");
    			p.textContent = "© Tamara Snyder 2022";
    			attr_dev(div0, "class", "content-wrap svelte-nrhryt");
    			add_location(div0, file$3, 4, 2, 51);
    			attr_dev(a0, "href", "https://www.linkedin.com/in/tamara-snyder-a6a1391b7/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-nrhryt");
    			add_location(a0, file$3, 7, 6, 148);
    			attr_dev(a1, "href", "https://github.com/tamara-snyder");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-nrhryt");
    			add_location(a1, file$3, 8, 4, 244);
    			attr_dev(a2, "href", "https://twitter.com/dev_tamara");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "svelte-nrhryt");
    			add_location(a2, file$3, 9, 4, 318);
    			attr_dev(div1, "class", "links-container svelte-nrhryt");
    			add_location(div1, file$3, 6, 4, 112);
    			add_location(p, file$3, 11, 4, 402);
    			attr_dev(footer, "id", "contact");
    			attr_dev(footer, "class", "svelte-nrhryt");
    			add_location(footer, file$3, 5, 2, 86);
    			attr_dev(div2, "class", "page-container svelte-nrhryt");
    			add_location(div2, file$3, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, footer);
    			append_dev(footer, div1);
    			append_dev(div1, a0);
    			append_dev(div1, t2);
    			append_dev(div1, a1);
    			append_dev(div1, t4);
    			append_dev(div1, a2);
    			append_dev(footer, t6);
    			append_dev(footer, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/ProjectCard.svelte generated by Svelte v3.46.6 */

    const file$2 = "src/ProjectCard.svelte";

    function create_fragment$2(ctx) {
    	let div1;
    	let h3;
    	let t0_value = /*project*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let a;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let a_href_value;
    	let t2;
    	let div0;
    	let p0;
    	let raw_value = /*project*/ ctx[0].description + "";
    	let t3;
    	let p1;
    	let strong;
    	let t5;
    	let t6_value = /*project*/ ctx[0].technologies + "";
    	let t6;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			a = element("a");
    			img = element("img");
    			t2 = space();
    			div0 = element("div");
    			p0 = element("p");
    			t3 = space();
    			p1 = element("p");
    			strong = element("strong");
    			strong.textContent = "Technologies:";
    			t5 = space();
    			t6 = text(t6_value);
    			attr_dev(h3, "class", "svelte-1y45w29");
    			add_location(h3, file$2, 5, 2, 65);
    			if (!src_url_equal(img.src, img_src_value = /*project*/ ctx[0].imageSource)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*project*/ ctx[0].imageAlt);
    			attr_dev(img, "class", "svelte-1y45w29");
    			add_location(img, file$2, 7, 4, 136);
    			attr_dev(a, "href", a_href_value = /*project*/ ctx[0].link);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$2, 6, 2, 92);
    			add_location(p0, file$2, 10, 4, 231);
    			add_location(strong, file$2, 11, 7, 273);
    			add_location(p1, file$2, 11, 4, 270);
    			attr_dev(div0, "class", "project-info svelte-1y45w29");
    			add_location(div0, file$2, 9, 2, 200);
    			attr_dev(div1, "class", "project svelte-1y45w29");
    			add_location(div1, file$2, 4, 0, 41);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(h3, t0);
    			append_dev(div1, t1);
    			append_dev(div1, a);
    			append_dev(a, img);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			p0.innerHTML = raw_value;
    			append_dev(div0, t3);
    			append_dev(div0, p1);
    			append_dev(p1, strong);
    			append_dev(p1, t5);
    			append_dev(p1, t6);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*project*/ 1 && t0_value !== (t0_value = /*project*/ ctx[0].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*project*/ 1 && !src_url_equal(img.src, img_src_value = /*project*/ ctx[0].imageSource)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*project*/ 1 && img_alt_value !== (img_alt_value = /*project*/ ctx[0].imageAlt)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*project*/ 1 && a_href_value !== (a_href_value = /*project*/ ctx[0].link)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*project*/ 1 && raw_value !== (raw_value = /*project*/ ctx[0].description + "")) p0.innerHTML = raw_value;			if (dirty & /*project*/ 1 && t6_value !== (t6_value = /*project*/ ctx[0].technologies + "")) set_data_dev(t6, t6_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProjectCard', slots, []);
    	let { project } = $$props;
    	const writable_props = ['project'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProjectCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('project' in $$props) $$invalidate(0, project = $$props.project);
    	};

    	$$self.$capture_state = () => ({ project });

    	$$self.$inject_state = $$props => {
    		if ('project' in $$props) $$invalidate(0, project = $$props.project);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [project];
    }

    class ProjectCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { project: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProjectCard",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*project*/ ctx[0] === undefined && !('project' in props)) {
    			console.warn("<ProjectCard> was created without expected prop 'project'");
    		}
    	}

    	get project() {
    		throw new Error("<ProjectCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set project(value) {
    		throw new Error("<ProjectCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Portfolio.svelte generated by Svelte v3.46.6 */
    const file$1 = "src/Portfolio.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (50:2) {#each projects as project}
    function create_each_block(ctx) {
    	let projectcard;
    	let current;

    	projectcard = new ProjectCard({
    			props: { project: /*project*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(projectcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(projectcard, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(projectcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(projectcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(projectcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(50:2) {#each projects as project}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let current;
    	let each_value = /*projects*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Portfolio";
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "svelte-1ruoinu");
    			add_location(h1, file$1, 47, 0, 2508);
    			attr_dev(div, "id", "portfolio");
    			attr_dev(div, "class", "svelte-1ruoinu");
    			add_location(div, file$1, 48, 0, 2527);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*projects*/ 1) {
    				each_value = /*projects*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Portfolio', slots, []);

    	let projects = [
    		{
    			title: 'Sweather',
    			link: 'https://github.com/tamara-snyder/Sweather',
    			imageSource: 'images/sweather_screenshot.png',
    			imageAlt: 'Screenshot of Sweather app for iPhone',
    			description: 'A simple weather app. With user permission, it fetches the local weather for the user\'s current location. There is also an option for the user to search for a specific city or zip code. A table view displays weather forecasts in three-hour time intervals for the next five days. Uses MVC architecture. Background art courtesy of <a href="freepik.com">freepik.com</a>.',
    			technologies: 'Swift, UIKit, CoreLocation, OpenWeatherMap API'
    		},
    		{
    			title: 'Aeropress Timer',
    			link: 'https://github.com/tamara-snyder/Aeropress-Timer',
    			imageSource: 'images/aerotimer_screenshot.png',
    			imageAlt: 'Screenshot of my custom Aeropress timer',
    			description: 'A custom Aeropress timer for brewing my morning Aeropress recipe. It runs two timers in succession with the ability to pause and resume or restart the brewing process at any time. A bell rings after the first timer to signal the next step in the brewing process.',
    			technologies: 'Swift, UIKit'
    		},
    		{
    			title: 'iOS Calculator Clone',
    			link: 'https://tamara-snyder.github.io/Calculator/',
    			imageSource: 'images/calculator_screenshot.png',
    			imageAlt: 'Screenshot of the iOS calculator replicated for the web',
    			description: 'A web-based replica of the iOS calculator. The challenge in this was to match the functionality exactly to Apple\'s version.',
    			technologies: 'Javascript, HTML, CSS'
    		},
    		{
    			title: 'Tic-Tac-Toe',
    			link: 'https://tamara-snyder.github.io/Tic-Tac-Toe-JS/',
    			imageSource: 'images/tictactoe_screenshot.png',
    			imageAlt: 'Screenshot of Tic-Tac-Toe with an unbeatable AI',
    			description: 'The classic game of Tic-Tac-Toe with the twist of an unbeatable AI. Created in plain JavaScript, HTML, and CSS.',
    			technologies: 'Javascript, HTML, CSS'
    		},
    		{
    			title: 'Hangman',
    			link: 'https://github.com/tamara-snyder/hangman',
    			imageSource: 'images/hangman_screenshot.png',
    			imageAlt: 'Screenshot of my Hangman game for the command line',
    			description: 'Chooses a random word from the dictionary. You have 10 tries to guess it! Built in Ruby for the command line.',
    			technologies: 'Ruby'
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Portfolio> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ ProjectCard, projects });

    	$$self.$inject_state = $$props => {
    		if ('projects' in $$props) $$invalidate(0, projects = $$props.projects);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [projects];
    }

    class Portfolio extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Portfolio",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.6 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let main;
    	let overview;
    	let t1;
    	let about;
    	let t2;
    	let portfolio;
    	let t3;
    	let contact;
    	let current;
    	header = new Header({ $$inline: true });
    	overview = new Overview({ $$inline: true });
    	about = new About({ $$inline: true });
    	portfolio = new Portfolio({ $$inline: true });
    	contact = new Contact({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(overview.$$.fragment);
    			t1 = space();
    			create_component(about.$$.fragment);
    			t2 = space();
    			create_component(portfolio.$$.fragment);
    			t3 = space();
    			create_component(contact.$$.fragment);
    			attr_dev(main, "class", "svelte-1lrzeoj");
    			add_location(main, file, 9, 0, 230);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(overview, main, null);
    			append_dev(main, t1);
    			mount_component(about, main, null);
    			append_dev(main, t2);
    			mount_component(portfolio, main, null);
    			insert_dev(target, t3, anchor);
    			mount_component(contact, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(overview.$$.fragment, local);
    			transition_in(about.$$.fragment, local);
    			transition_in(portfolio.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(overview.$$.fragment, local);
    			transition_out(about.$$.fragment, local);
    			transition_out(portfolio.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(overview);
    			destroy_component(about);
    			destroy_component(portfolio);
    			if (detaching) detach_dev(t3);
    			destroy_component(contact, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Overview,
    		About,
    		Contact,
    		Portfolio
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
